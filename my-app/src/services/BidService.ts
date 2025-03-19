

const getAllBidsOfUser = async(token : string) => {
    const GET_ALL_BID_URL = import.meta.env.VITE_GET_ALL_BID_URL
    console.log("logging token from bids service",token)
    const res = await fetch(GET_ALL_BID_URL,{
        method : "GET",
        headers : {
            'Authorization' : `Bearer ${token}`
        }
    })
    console.log("respose from bids service",res)
    const data = await res.json()
    console.log(data)
    return data;
}

 const placeBid = async (token : string,payload : {
    project_id : number,
    amount : number
}) => {
    const ADD_BID_URL = import.meta.env.VITE_PLACE_BID_URL;
    const res = await fetch(ADD_BID_URL,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',    
            'authorization' : `Bearer ${token}`
        },
        body : JSON.stringify(payload)
    })
    console.log("Logging PlaceBid response From bids service : ",res);
}
const removeBidById = async (token:string,project_id : number) => {
    const REMOVE_BID_URL = import.meta.env.VITE_REMOVE_BID_URL;
    const res = await fetch(REMOVE_BID_URL,{
        method : 'DELETE',
        headers : {
            'Content-Type' : 'application/json',    
            'authorization' : `Bearer ${token}`
        },
    })
    console.log("Logging PlaceBid response From bids service : ",res);
}
export {getAllBidsOfUser,placeBid}