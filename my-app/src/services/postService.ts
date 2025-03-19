
export const getAllPostsOfUser = async (token  : string) => {
    const FETCH_ALL_POSTS_OF_USER_URL = import.meta.env.VITE_GET_ALL_USER_POST
    const res = await fetch(FETCH_ALL_POSTS_OF_USER_URL,{
        headers : {
            'Authorization' : `Bearer ${token}`
        }
    })
    const data = await res.json();
    console.log("GEt all user posts : ",data)
    return data.data;
}

export const createPost = async (token : string ,data : any) => {
    const CREATE_POST_URL = import.meta.env.VITE_CREATE_POST_URL
    const res = await fetch(CREATE_POST_URL,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body : JSON.stringify(data)
    })
    if(res) {
        const resData = await res.json();
        console.log("post created succesfully",resData)
    }
    else {
        console.log("error while creating post");
        
    }
}


export const deletePost = async (token : string, id : number) => {
    
    const DELETE_POST_URL = `${import.meta.env.VITE_DELETE_POST_URL}/${id}`
    console.log("DELETE_POST_URL : ",DELETE_POST_URL);
    
    const res = await fetch(DELETE_POST_URL,{
        method : 'DELETE',
        headers : {
           'Authorization' : `Bearer ${token}`   
        }
    });
    if(res) {
        const data = await res.json();
        console.log("POST DELTED SUCCESFULLY FROM SERVICE : ",data)
    }
}


export const updatePost = async (token : string,id:number,data : any) => {
   
    console.log("BODY : ",data)
    const UPDATE_URL = `${import.meta.env.VITE_UPDATE_POST_URL}/${id}`
    const res = await fetch(UPDATE_URL,{
        method  : 'PUT',
        headers : {
            'Authorization' : `Bearer ${token}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data)
    })
    if(res)
    {
        const data = await  res.json()
        console.log("From postService updated POST : ",data);
    return data;
    }
    return {}
}