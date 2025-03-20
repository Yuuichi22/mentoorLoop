import { useForm, Resolver } from "react-hook-form";
import { getPublicUrl, uploadImage } from "../services/supabaseService";
import { updateUser } from "../services/userService";
import { useDispatch, useSelector } from "react-redux";
import defaultProfile from "../assets/defaultProfile.webp";
import { useRef, useState ,useEffect} from "react";

interface FormValues {
  firstname: string;
  lastname: string;
  bio?: string;
  university?: string;
  batch?: number;
  course?: string;
  experience?: number;
  company?: string;
  role?: string;
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
  const profileRef = useRef<HTMLInputElement>(null);
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState(user?.profileUrl || defaultProfile);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: { ...user },
    resolver,
  });

  const onSubmit = async (formData: FormValues) => {
    let url = user?.profileUrl || "";

    if (selectedFile) {
      const res = await uploadImage(selectedFile);
      if (!res.error) {
        url = getPublicUrl(res.data.path);
      }
    }

    const data = { ...formData, profilePic: url };
    console.log(data);

    const token: string | null = localStorage.getItem("token");
    if (token) updateUser(dispatch, token, data);
  };

  return (
    <div className="p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="m-10 p-10 shadow-xl bg-white rounded-lg flex flex-col gap-4">
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center">
          <div className="rounded-full overflow-hidden h-24 w-24 cursor-pointer" onClick={() => profileRef.current?.click()}>
            <img src={profilePicPreview} alt="Profile" className="h-24 w-24 rounded-full object-cover" />
          </div>
          <input
            type="file"
            accept="image/*"
            ref={profileRef}
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) {
                setProfilePicPreview(URL.createObjectURL(e.target.files[0])); // Show preview
                setSelectedFile(e.target.files[0]); // Store file
              }
            }}
          />
        </div>

        {/* Name Inputs */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Firstname</label>
          <input type="text" placeholder="Firstname" {...register("firstname")} className="border rounded-lg p-2" />
          {errors.firstname && <p className="text-red-500 text-xs">{errors.firstname.message}</p>}

          <label className="text-sm font-medium">Lastname</label>
          <input type="text" placeholder="Lastname" {...register("lastname")} className="border rounded-lg p-2" />
          {errors.lastname && <p className="text-red-500 text-xs">{errors.lastname.message}</p>}
        </div>

        {/* Bio Input */}
        <div>
          <label className="text-sm font-medium">Bio</label>
          <textarea placeholder="Bio" {...register("bio")} className="bg-gray-100 w-full p-2 rounded-lg border" />
        </div>

        {/* Alumni or Student Fields */}
        {user?.user_type === "ALUMINI" ? (
          <div className="flex flex-col space-y-2">
            <input type="text" {...register("company")} placeholder="Company" className="border rounded-lg p-2" />
            <input type="text" {...register("role")} placeholder="Role" className="border rounded-lg p-2" />
            <input type="number" {...register("experience")} placeholder="Experience (years)" className="border rounded-lg p-2" />
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <input type="text" {...register("university")} placeholder="University" className="border rounded-lg p-2" />
            <input type="number" {...register("batch")} placeholder="Batch Year" className="border rounded-lg p-2" />
            <input type="text" {...register("course")} placeholder="Course" className="border rounded-lg p-2" />
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="bg-black text-white py-2 px-4 rounded-lg">
          Save Changes
        </button>
      </form>
    </div>
  );
};
