import ExpressError from './ExpressError.js'

export default function catchAsync(fn){
    return function(req,res,next){
     fn(req,res,next).catch(err=> next(new ExpressError(err.message, 500)))
   }
 }