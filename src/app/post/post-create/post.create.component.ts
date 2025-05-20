import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PostsService } from "../post.service";
import { Post } from "../post.model";
import { mimetype } from "./mime-type.validator";


@Component({
  selector: "app-post-create",
  templateUrl: "./post.create.component.html",
  styleUrls: ["./post.create.component.css"],
})
export class PostCreateComponent implements OnInit {
post: Post = { id: '', title: '', content: '', imagePath: '', likes: 0, creator: '' };


  mode = 'create';
  postId: string | any;
  isLoading = false;
  form!: FormGroup;
  Pickedimage: string | any;


  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.isLoading = false;


    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimetype] })
    });


    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;


        if (this.postId) {
          this.postsService.getPost(this.postId).subscribe((postData) => {
            this.isLoading = false;
            this.post = {
              id: postData.id,
              title: postData.title,
              content: postData.content,
              imagePath: postData.imagePath,
              likes: postData.likes ?? 0,
              creator: postData.creator
            };
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.imagePath
            });
          });
        }
      } else {
        this.mode = 'create';
        this.postId = null;
        this.post = { id: '', title: '', content: '', imagePath: '', likes: 0, creator: '' };
      }
    });
  }


  PickedImage(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }


    this.form.patchValue({ image: file });
    this.form.get("image")?.updateValueAndValidity();


    const reader = new FileReader();
    reader.onload = () => {
      this.Pickedimage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }


  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;


    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId!,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }


    this.form.reset();
    this.Pickedimage = null;
    this.router.navigate(["/"]);
  }
}



