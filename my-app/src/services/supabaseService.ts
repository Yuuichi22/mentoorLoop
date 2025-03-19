import {createClient} from '@supabase/supabase-js'

const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const SUPABASE_URL = "https://aekqimyqcuyhdjzvoatn.supabase.co";
const supabase = createClient(SUPABASE_URL,SUPABASE_KEY)

const uploadImage = async (file : any) => {
    return  await supabase.storage.from("mentorloop").upload(`public/${file.name}`,file,{ cacheControl: "3600", upsert: false });
}
const getPublicUrl = (filePath : string) => {
    const { data } = supabase
        .storage
        .from("mentorloop")
        .getPublicUrl(filePath);
    return data.publicUrl;
};

const deleteImage = async (filePath : string) => {
    const { error } = await supabase
        .storage
        .from("mentorloop")
        .remove([filePath]);

    if (error) {
        console.error("Delete Error:", error);
    } else {
        console.log("Image Deleted Successfully");
    }
};

export {uploadImage,getPublicUrl}