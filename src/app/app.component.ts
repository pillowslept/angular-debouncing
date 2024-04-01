import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject, debounceTime } from 'rxjs';

const URL = 'https://pokeapi.co/api/v2/pokemon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public results: string[] = [];
  public isLoading: boolean = false;

  private searchSubject = new Subject<string>();

  constructor(
    private readonly http: HttpClient
  ) { }

  ngOnInit() {
    this.searchSubject.pipe(debounceTime(500)).subscribe((searchValue) => {
      this.isLoading = true;
      setTimeout(() => this.searchForQuery(searchValue), 1000)
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  public onSearch(event: any) {
    this.results = [];

    if (!event.value) {
      return;
    }

    this.searchSubject.next(event.value);
  }

  private searchForQuery(query: string) {
    this.isLoading = true;
    const request = this.http.get(URL);

    request.subscribe({
      next: (data: any) => {
        const results: string[] = data.results.filter(({ name }: any) => name.includes(query));
        this.results = results.map(({ name }: any) => name);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => this.isLoading = false
    });
  }
}
