export const getAllProjectsOfUser = async (token  : string) => {
    console.log("hrer");
    const FETCH_ALL_PROJECTS_OF_USER_URL = import.meta.env.VITE_GET_ALL_USER_PROJECT 
    const res = await fetch(FETCH_ALL_PROJECTS_OF_USER_URL,{
        headers : {
            'Authorization' : `Bearer ${token}`
        }
    })
    
    
    const data = await res.json();
    console.log(data);
    return data.data;
}

export const createProject = async (token : string ,data : any) => {
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
        console.log("project created succesfully",resData)
    }
    else {
        console.log("error while creating project");
        
    }

}