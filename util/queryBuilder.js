class queryBuilder {
  constructor(ExpressQuery, mongooseQuery) {
    this.expressQuery = ExpressQuery;
    this.mongooseQuery = mongooseQuery;
  }

  filter() {
    //1-A)Filtering: remove unwanted objects from the request query
    //-a-get query request
    const queryObj = { ...this.expressQuery }; //here we make a hard copy of the query request
    //-b-create array of excluded fields
    const excluded = ['sort', 'limit', 'page', 'fields'];
    //-c-remove the execluded field from the query copy
    excluded.forEach(el => delete queryObj[el]);

    // 1-B)Filtering;
    //-a-stringify request
    let queryStr = JSON.stringify(queryObj);
    //-b-search for operation and add $ before
    queryStr = queryStr.replace(/\b(gt|lt|gte|lte)\b/g, match => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    //2)Sorting:
    //--check if request contains sort
    if (this.expressQuery.sort) {
      //--get sort then remove the camma and put space instead if the request sort on multiple documents
      const sort = this.expressQuery.sort.split(',').join(' ');
      //add the sort to the query
      this.mongooseQuery = this.mongooseQuery.sort(sort);
    } else {
      //if request doesnt want a sort, it will sort accourding to the new inserted tours in descending order (-)
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    //3)Fields: get a selected fields only
    //--check if request contains fields
    if (this.expressQuery.fields) {
      //--remove the comma and add a space instead if the request want multiple fields
      const fields = this.expressQuery.fields.split(',').join(' ');
      //--add  fields to the query
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      //-- if the request doesnt have fields then remove the __v from the responsed fields
      this.mongooseQuery = this.mongooseQuery.select('-__v');
    }
    return this;
  }
  paginate() {
    // 4) pagination
    //--get page and limit from query
    const page = this.expressQuery.page || 1;
    const limit = this.expressQuery.limit || 10;
    //--calculate the number of skipped documents
    const skip = (page - 1) * limit;
    //--add number of skipped documents and limit of documents to the query object
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }
}
module.exports = queryBuilder;
