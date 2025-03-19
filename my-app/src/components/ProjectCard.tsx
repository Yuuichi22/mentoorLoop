import { Tuple } from '@reduxjs/toolkit';
import {CardWrapper} from './CardWrapper';

export const ProjectCard = ({id,title,content} : {
    id : number,
    title : string,
    content : string,
   // author : string,
    //tags : string[]
}) => {
    return (
    <CardWrapper url = {`project/${id}`}>
         <div className="text-lg font-semibold">
            {title}
        </div>
        <div className="text-gray-500">
           "@{/*author*/}"
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