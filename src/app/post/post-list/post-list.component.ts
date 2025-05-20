import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Post } from "../post.model";
import { PostsService } from "../post.service";
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from "src/app/authentication/auth-service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  totalposts = 10;
  postperpage = 2;
  currentpage = 1;
  pageSizeOption = [1, 2, 5, 10];

  isLoading = false;

  posts: Post[] = [];
  private postsSub!: Subscription;
  searchTerm: string = '';
  sortType: string = 'name';
  userId: string | null = null;
  userIsAuthenticated = false;
  private authStatusSub!: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService) {}

  onLike(post: Post): void {
    if (!post.likes) {
      post.likes = 1;
    } else {
      post.likes++;
    }

    this.postsService.updateLikes(post.id, post.likes).subscribe({
      next: () => {
        console.log('Likes updated successfully');
      },
      error: (error) => {
        console.error('Error updating likes:', error);
      }
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.fetchPosts();

    this.userId = this.authService.getUserId();

    this.postsSub = this.postsService.getPostUpdatedListener()
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.posts = postData.posts;
        this.totalposts = postData.postCount;
        this.sortPosts(); // Apply sort on data fetch
        this.isLoading = false;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  fetchPosts(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postperpage, this.currentpage);
  }

  onChangedPage(pageData: PageEvent): void {
    this.isLoading = true;
    this.currentpage = pageData.pageIndex + 1;
    this.postperpage = pageData.pageSize;
    this.fetchPosts();
  }

  onDelete(postId: string): void {
    this.isLoading = true;
    this.postsService.deletePost(postId)
      .subscribe({
        next: () => this.fetchPosts(),
        error: (error) => {
          console.error('Error deleting post:', error);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.postsSub) {
      this.postsSub.unsubscribe();
    }
    if (this.authStatusSub) {
      this.authStatusSub.unsubscribe();
    }
  }

  filteredPosts(): Post[] {
    let filtered = this.posts;
    if (this.searchTerm) {
      const lowerTerm = this.searchTerm.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(lowerTerm) ||
        post.content.toLowerCase().includes(lowerTerm)
      );
    }

    return this.getSorted(filtered);
  }

  onView(post: Post): void {
    if (!post.viewed) {
      this.postsService.incrementViews(post.id).subscribe({
        next: () => {
          post.views = (post.views || 0) + 1;
          post.viewed = true;
        },
        error: (err) => {
          console.error('Failed to increment views', err);
        }
      });
    }
  }

  onSortChange(value: string): void {
    this.sortType = value;
    this.sortPosts();
  }

  sortPosts(): void {
    this.posts = this.getSorted(this.posts);
  }

  private getSorted(posts: Post[]): Post[] {
    return [...posts].sort((a, b) => {
      if (this.sortType === 'name') {
        return a.title.localeCompare(b.title);
      } else if (this.sortType === 'views') {
        return (b.views || 0) - (a.views || 0);
      } else {
        return 0;
      }
    });
  }
}
