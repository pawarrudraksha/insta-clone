
class ApiError extends Error{
    statusCode:number
    success:boolean
    errors:any

    constructor(
        statusCode:number,
        message:string="Something went wrong",
        errors:any=[],
        stack:string='',
        success:boolean=false
    ){
        super(message)
        this.statusCode=statusCode
        this.message=message
        this.success=success
        this.errors=errors
        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}