export interface Post{
    id: any;
    title: string;
    content: string;
    imagePath: string;  
    likes: number;
    comments?: any[];
    creator: string;
    views?: number;
    viewed?: boolean;
    date?: Date;


}

