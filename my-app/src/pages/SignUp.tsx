import {useForm,Resolver} from 'react-hook-form'
import { registerUser } from '../services/authService'
import { useDispatch} from 'react-redux'
enum user_type{
    STUDENT = "STUDENT",
    ALUMINI = "ALUMINI"
}

type FormValues = {
     firstname : string,
     lastname : string,
     user_type : user_type
     email : string,
    password : string
}


export const SignUp = () => {
    const dispatch = useDispatch()
    const resolver: Resolver<FormValues> = async (values) => {
        const errors: Record<string, any> = {};
        if(!values.firstname) {
            errors.firstname = {type : "required",message : "firstname is required"}
        }
        if(!values.lastname) {
            errors.lastname = {type : "required",message : "lastname is required"}
        }
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
const onsubmit = async (data : FormValues) => {
   const resData = await registerUser(dispatch,data);
console.log(resData);
   
    console.log(data)
}
return (
    <div className='p-20 text-sm'>
         <form onSubmit={handleSubmit(onsubmit)} className='flex flex-col w-full gap-2 items-center '>
            <label htmlFor="">FirstName :</label>
            <input type="text" className='text-sm bg-gray-200 rounded-lg py-1 px-2' {...register("firstname",{required : true})} />
            {errors.firstname && <p className="text-red-500">{errors.firstname.message}</p>}
            <label htmlFor="">LastName :</label>
            <input type="text" className='text-sm bg-gray-200 rounded-lg py-1 px-2' {...register("lastname",{required : true})} />
            {errors.lastname && <p className="text-red-500">{errors.lastname.message}</p>}
            <label htmlFor="">User Type :</label>
            <select  className='text-sm' {...register("user_type",{required : true})} >
            <option value="STUDENT">STUDENT</option>
            <option value="ALUMINI">ALUMINI</option>
            </select>
            <label htmlFor="">Email  :</label>
            <input type='email' placeholder='example@gmail.com' {...register("email",{required : true})} className='text-sm bg-gray-200 rounded-lg py-1 px-2'/>
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            <label htmlFor="">Password  :</label>
            <input type='password' className='text-sm bg-gray-200 rounded-lg py-1 px-2'  {...register("password",{required : true})}/>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            <button type="submit" className=' bg-black text-white px-4 py-1 rounded-2xl'>
                SignUp
            </button>
           
         </form>
    </div>
   
)
}