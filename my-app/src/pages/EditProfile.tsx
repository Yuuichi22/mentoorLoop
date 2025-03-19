import { useForm, Resolver } from "react-hook-form";
import { getPublicUrl, uploadImage } from "../services/supabaseService";
import { updateUser } from "../services/userService";
import { useDispatch, UseDispatch } from "react-redux";
interface FormValues {
  profilePic: FileList;
  firstname: string;
  lastname: string;
  bio?: string;
}

const resolver: Resolver<FormValues> = async (values) => {
  const errors: Record<string, { type: string; message: string }> = {};

  if (!values.firstname) errors.firstname = { type: "required", message: "Firstname is required" };
  if (!values.lastname) errors.lastname = { type: "required", message: "Lastname is required" };

  return {
    values: Object.keys(errors).length ? {} : values,
    errors,
  };
};



export const EditProfile = () => {
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver });
  const onSubmit = async (formData: FormValues) => {
    let url = "";
  
    if (formData.profilePic.length > 0) {
      const file = formData.profilePic[0]; // ✅ Extract the file
      const res = await uploadImage(file);
      if (!res.error) {
        url = getPublicUrl(res.data.path); // ✅ Use `path` instead of `fullPath`
      }
    }
  
    const data = {
      ...formData,
      profilePic: url, // Store image URL
    };
    const token : string | null = localStorage.getItem('token')
    if(token)
    updateUser(dispatch,token,data)
  };
  return (
    <div className="pt-25">
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      {/* File Upload */}
      <div>
        <label className="block font-medium">Profile Picture</label>
        <input type="file" {...register("profilePic")} accept="image/*" className="block w-full border p-2" />
      </div>

      {/* Firstname */}
      <div>
        <label className="block font-medium">Firstname</label>
        <input type="text" {...register("firstname", { required: true })} className="block w-full border p-2" />
        {errors.firstname && <p className="text-red-500">{errors.firstname.message}</p>}
      </div>

      {/* Lastname */}
      <div>
        <label className="block font-medium">Lastname</label>
        <input type="text" {...register("lastname", { required: true })} className="block w-full border p-2" />
        {errors.lastname && <p className="text-red-500">{errors.lastname.message}</p>}
      </div>

      {/* Bio */}
      <div>
        <label className="block font-medium">Bio</label>
        <textarea {...register("bio")} className="block w-full border p-2"></textarea>
      </div>

      <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Submit</button>
    </form>
    </div>
  );
};
