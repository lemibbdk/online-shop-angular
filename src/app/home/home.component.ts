import {Component, OnInit, ViewChild} from '@angular/core';
import {ItemService} from '../item/item.service';
import {Item} from '../item/item';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {UserService} from '../auth/user.service';
import {MatPaginator} from '@angular/material/paginator';
import {Options} from '@angular-slider/ngx-slider';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  categories = [];
  subCategories = [];

  showHome = false;

  subCategory: string;

  showItems = false;
  items: Item[];

  counter = 0;

  currentCategory: string;

  routeParams = [];

  broadItems: MenuItem[];
  home: MenuItem;

  isSearch = false;

  sort = 'asc';
  orderBy = 'price';
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;

  selectedOrderBy = 'price';
  selectedSort = 'asc';

  minValue = 0;
  maxValue = 0;
  options: Options = {
    floor: 0,
    ceil: 0
  };

  searchValue = '';

  uniqueSearchCategories = [];
  uniqueSearchSubCategories = [];

  selectedCategorySearch = '';
  selectedSubCategorySearch = '';

  helper = '';

  mostFavoriteItems: Item[] = [];
  bestBuyItems: Item[] = [];
  bestRatedItems: Item[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private itemService: ItemService, private userService: UserService, public authService: AuthService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.readCategories();

    this.readBestRatedItems()

    this.route.params.subscribe(params => {
      const category = params.category;
      const subCategory = params.subCategory;
      this.routeParams = Object.values(params);
      const arr = [];
      Object.values(params).forEach((el, i) => {
        arr.push({label: el, routerLink: '/items/' + this.routeParams.slice(0, i + 1 ).join('/')});
      });

      this.broadItems = arr;

      this.home = {icon: 'pi pi-home', routerLink: '/home'};

      if (params.term) {
        this.isSearch = true;
        this.showHome = false;
        // const searchField = document.getElementById('searchField') as HTMLInputElement;

        this.searchValue = params.term.split('key-').join(' ').trim();
        this.minValue = 0;
        this.maxValue = 0;

        this.readItems();

      } else if (!subCategory) {
        if (Object.keys(params).length === 0) {
          this.showHome = true;
          this.readMostFavoriteItems();
          this.readBestBuyItems();
        } else {
          this.showHome = false;
          this.searchValue = '';
          this.readSubCategories(category);
        }
      } else {
        this.showHome = false;
        this.subCategory = subCategory;
        this.readItems();
      }
    });
  }

  readCategories(): void {
    this.itemService.readCategories().subscribe({
      next: data => {
        this.categories = data;
        this.categories.sort((a, b) => {
          if (a < b) { return -1; }
          if (a > b) { return  1; }
          return 0;
        });
      },
      error: err => {
        console.log(err);
      }
    });
  }

  readSubCategories(category): void {
    this.showItems = false;
    this.isSearch = false;
    this.currentCategory = category;
    this.itemService.readSubCategories(category).subscribe({
      next: data => {
        this.subCategories = data;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  readBestBuyItems(): void {
    this.itemService.readBestBuyItems().subscribe({
      next: value => {
        // this.bestBuyItems = value;
        this.bestBuyItems = value.map(el => el.item);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  readMostFavoriteItems(): void {
    this.itemService.readMostFavoriteItems().subscribe({
      next: value => {
        this.mostFavoriteItems = value.map(el => el.item);
      },
      error: err => {
        this.mostFavoriteItems = err;
      }
    });
  }

  readBestRatedItems(): void {
    this.itemService.readBestRatedItems().subscribe({
      next: value => {
        this.bestRatedItems = value;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  readItems(): void {
    if (this.selectedOrderBy === 'totalEvaluation') {
      this.items.sort((a, b) => {
        if (a.locatedIn === this.authService.userProfile.place && b.locatedIn !== this.authService.userProfile.place) {
          return -1;
        } else if (a.locatedIn !== this.authService.userProfile.place && b.locatedIn === this.authService.userProfile.place) {
          return 1;
        }

        return 0;
      });

      if (this.selectedSort === 'desc') {
        this.items.reverse();
      }

      return;
    }

    const sortBy = this.selectedOrderBy + ':' + this.selectedSort;
    const pageSize = this.paginator ? this.paginator.pageSize + '' : this.pageSize + '';
    const pageIndex = this.paginator ? this.paginator.pageIndex + '' : '0';
    const minValue = this.minValue ? this.minValue + '' : '0';
    const maxValue = this.maxValue ? this.maxValue + '' : '0';
    const subCategory = this.selectedSubCategorySearch === '' ? this.subCategory : this.selectedSubCategorySearch;

    this.itemService.readItems(subCategory, this.selectedCategorySearch, pageSize, pageIndex, sortBy,
      minValue, maxValue, this.searchValue)
      .subscribe({
      next: data => {
        this.items = data.items;
        this.totalItems = data.totalItems;

        this.showItems = true;
        this.pricesHandler(data.items);

        if (this.searchValue !== '' && this.searchValue !== this.helper) {
          const categories = [];
          const subCategories = [];
          this.items.forEach(el => {
            if (!categories.includes(el.category)) {
              categories.push(el.category);
            }
            if (!subCategories.includes(el.subCategory)) {
              subCategories.push(el.subCategory);
            }
          });

          this.uniqueSearchCategories = categories;
          this.uniqueSearchSubCategories = subCategories;

          this.helper = this.searchValue;
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  pricesHandler(data): void {
    const prices = [];

    data.forEach(item => {
      const calcPrice = item.price - (item.price * item.discount / 100);
      prices.push(calcPrice);
    });

    prices.sort((a, b) => a > b ? 1 : -1);

    if (prices.length === 1) {
      this.changeOptions(0, prices[0]);
    } else {
      this.changeOptions(prices[0], prices[prices.length - 1]);
    }

  }

  changeOptions(min, max): void {
    if (this.minValue === 0 && this.maxValue === 0) {
      const newOptions: Options = Object.assign({}, this.options);
      newOptions.floor = min;
      newOptions.ceil = max;

      this.options = newOptions;

      this.minValue = min;
      this.maxValue = max;
    } else {
      this.minValue = min;
      this.maxValue = max;
    }
  }

}
