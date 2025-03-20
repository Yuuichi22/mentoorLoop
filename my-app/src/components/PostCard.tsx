import {CardWrapper} from './CardWrapper';

export const PostCard = ({id,title,content,tags,user} : {
    id : number,
    title : string,
    content : string,
    user : any
    tags : string[]
}) => {
    console.log('Posts')
    return (
    <CardWrapper url =  {`posts/${id}`}>
         <div className="text-gray-500">
           @{user.firstname}
           <br />
           {user.bio}
        </div>
         <div className="text-lg font-semibold">
            {title}
        </div>
       
        <div className="text-sm">
            {content}
        </div>
        <div className='tags flex gap-2'>
        {/*tags.map((tag) => {
            return (
            <div className='shadow-2xs rounded-lg  px-4 bg-gray-200 text-sm'>
                {tag}
            </div>)
        })*/}
        </div>
     
    </CardWrapper>
    )
}