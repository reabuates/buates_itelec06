import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { Post } from "../post.model";
import { PostsService } from "../post.service"

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css'],
})




export class PostListComponent implements OnInit, OnDestroy {
    posts: Post[] = [];
    private postsSub!: Subscription;




    constructor(public postsService: PostsService) {}




    ngOnInit(): void {
        this.postsService.getPosts();
        this.postsSub = this.postsService.getPostUpdatedListener()
            .subscribe((posts: Post[]) => {
                this.posts = posts;
            });
    }




    onDelete(postId: string){
        this.postsService.deletePost(postId);
    }




    ngOnDestroy(): void {
        if (this.postsSub) {
            this.postsSub.unsubscribe();
        }
    }
}



