import { PROJECT_STATUS } from "@prisma/client";
import { ProfileEntity } from "../profile/profile.entity";
import { MessageEntity } from "../messages/messageListItem.entity";

export type ProjectEntity = {
    id:string;
    title:string;
    description?:string | null;
    createdAt:string;
    updatedAt:string;
    status:PROJECT_STATUS;
    isDeleted:boolean;
    messages:MessageEntity[];
    creator:ProfileEntity;
    membersCount:number;
}