import {useForm,Resolver} from 'react-hook-form'
import { loginUser } from '../services/authService';
import { useDispatch } from 'react-redux';
type FormValues = {
     email : string,
    password : string
}


export const Login = () => {
    const dispatch = useDispatch()
    const resolver: Resolver<FormValues> = async (values) => {
        const errors: Record<string, any> = {};
        
        if (!values.email) {
            errors.email = { type: "required", message: "email is required" };
        }
        
        if (!values.password ) {
            errors.password = { type: "required", message: "Password is required" };
        }
        else if(values.password.length < 8) {
            errors.password = {
                type : "required",
                message : "password should atleast be 8 characters long "
            }
        }
    
        return {
            values: Object.keys(errors).length === 0 ? values : {},
            errors: errors,
        };
    };
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver });
const onsubmit = async (data : {email : string,password : string}) => {
    const resData = await loginUser(dispatch,data);
    console.log(resData)
}
return (
    <div className='p-20'>
         <form onSubmit={handleSubmit(onsubmit)} className='flex flex-col w-full gap-2 items-center '>
            <label htmlFor="">Email  :</label>
            <input type='email' placeholder='example@gmail.com' {...register("email",{required : true})} className='text-sm bg-gray-200 rounded-lg py-1 px-2'/>
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            <label htmlFor="">Password  :</label>
            <input type='password' className='text-sm bg-gray-200 rounded-lg py-1 px-2'  {...register("password",{required : true})}/>
            
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            <button type="submit" className=' bg-black text-white px-4 py-1 rounded-2xl'>
                Login
            </button>
           
         </form>
    </div>
   
)
}