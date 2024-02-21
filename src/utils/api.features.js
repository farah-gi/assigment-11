import paginationFunction from "./pagination"

class apiFeatures{
    //mongooseQuery=model.find()
    //query=req.query
    constructor(query,mongooseQuery){
        this.query=query,
        this.mongooseQuery=mongooseQuery
    }
    /**
     * 
     * pagination({ page, size }) {
        const { limit, skip } = paginationFunction({ page, size })  //{limit: 2, skip: 0}
        // console.log({ limit, skip });
        this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip)  // mongoose query
        return this
    }
     */
    pagination({page,size}){
    const{limit,skip}=paginationFunction({page,size})
    this.mongooseQuery=this.mongooseQuery.limit(limit).skip(skip)
    return this
    }
    sort(sortBy){
       if(sortBy){
        this.mongooseQuery=this.mongooseQuery.sort({createdAt:-1})
        return this
       }
       const formula=sortBy.replace(/desc/g,"-1").replace(/asc/g,"1").replace(/ /g,":")
       console.lo(formula)
       const[key,value]=formula.split(":")
       this.mongooseQuery=this.mongooseQuery.sort({[key]:value})
        return this
    }
    search(search){
        const queryfilter={}
        if(search.title)queryfilter.title={$regex:search.title,$options:"i"}
        if(search.desc)queryfilter.desc={$regex:search.desc,$options:"i"}
        if(search.priceFrom &&!search.priceTo)queryfilter.appliedPrice={$gte:search.priceFrom}
        if(search.priceTo &&!search.priceFrom)queryfilter.appliedPrice={$lte:search.priceTo}
        if(search.priceFrom&&search.priceTo)queryfilter.appliedPrice={$gte:search.priceFrom,$lte:search.priceTo}
        this.mongooseQuery=this.mongooseQuery(queryfilter)
        return this
    }
/**
 * u
 * filters data ely gaya
 * stock[gte]=100
 * transform this data into operator object so that the data base will understand
 * {stock:{$gte:100}
 */
    filter(filters){
     const queryFilters=JSON.stringify(filters).replace(/gte||lte||in||eq||neq/g,(operator)=>`$${operator}`)
        this.mongooseQuery=this.mongooseQuery(Json.parse(queryFilters))
        return this
     }

    
}