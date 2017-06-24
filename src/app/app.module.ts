import { BrowserModule } from '@angular/platform-browser'
// import * as Raven from 'raven-js'
import { NgModule, ErrorHandler, Renderer2 } from '@angular/core'
import { FormsModule, ReactiveFormsModule} from '@angular/forms'
import {HttpModule} from '@angular/http'
import { RouterModule, Routes } from '@angular/router'
import { AppComponent } from './app.component'
import { ListingComponent } from './components/content/listing/list.component'
import { ListItemComponent } from './components/content/listing/list-item.component'
import { HeaderComponent } from './components/global/header.component'
import { PrimaryNavComponent } from './components/navigation/primary-nav.component'
import { SearchComponent } from './components/navigation/search.component'
import { CallToActionComponent } from './components/messaging/call-to-action.component'
import { ItemComponent } from './components/content/item/item.component'
import { ItemListComponent } from './components/content/item/list.component'
import { VideoComponent } from './components/content/item/video.component'
import { AudioComponent } from './components/content/item/audio.component'
import { ListFilterComponent } from './components/content/listing/filter.component'
import { ListingSortComponent } from './components/content/listing/sort.component'
import { DataService } from './services/data.service'
import { ListService } from './services/list.service'
import { UserService } from './services/user.service'
import { MetaService } from './services/meta.service'
import { QueryStringPipe } from './pipes/query-string.pipe'
import { ImagePipe } from './pipes/image.pipe'
import { AttributePipe } from './pipes/attribute.pipe'
import { PaginationPipe } from './pipes/pagination.pipe'
import { EmbedMenuPipe } from './pipes/embed-menu.pipe'
import { SanitiseUrlPipe } from './pipes/sanitise-url.pipe'
import { ConfirmationPopoverModule } from 'angular-confirmation-popover'
import { Auth, AUTH_PROVIDERS, LoggedInGuard } from './services/auth.service'
// import { ClipboardModule } from 'ngx-clipboard'
import { FooterComponent } from './components/global/footer.component'
import { HomeComponent } from './components/content/home/home.component'
import { HomeListingComponent } from './components/content/home/list.component'
import { HomeSortComponent } from './components/content/home/sort.component'
import { CarouselComponent } from './components/content/home/carousel.component'
import { PartnersCarouselComponent } from './components/shared/partners-carousel.component'
// import { SwiperModule } from 'ngx-swiper-wrapper'
// import { SwiperConfigInterface } from 'ngx-swiper-wrapper'
import { SwiperModule } from '../../node_modules/angular2-useful-swiper'
import { EventsBlockComponent } from './components/shared/events.component'
import { TopicsComponent } from './components/shared/topics.component'
import { AwardsComponent } from './components/messaging/awards.component'
import { CookieNoticeComponent } from './components/messaging/cookie-notice.component'
import { PageComponent } from './components/content/pages/page.component'
import { ItemPageComponent } from './components/content/pages/item-page.component'
import { FooterNavComponent } from './components/navigation/footer-nav.component'
import { UserNavComponent } from './components/navigation/user-nav.component'
import { PagesNavComponent } from './components/navigation/pages-nav.component'
import { AccessibilityNavComponent } from './components/navigation/accessibility-nav.component'
import { CalendarComponent } from './components/content/calendar/calendar.component'
import { EventComponent } from './components/content/event/event.component'
import { ProfileComponent } from './components/profile/profile.component'
import { ProfileResolver } from './components/profile/profile.resolver'
import { UserListsComponent } from './components/profile/lists.component'
import { UserListComponent } from './components/profile/list.component'
import { Angulartics2Module } from 'angulartics2'
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga'
import { FeedbackComponent } from './components/shared/feedback.component'
import { RmAuthComponent } from './components/profile/rm-auth.component'
import { MetaGuard } from '@ngx-meta/core'
import { MetaModule, MetaLoader, MetaStaticLoader, PageTitlePositioning } from '@ngx-meta/core'

// import {PopoverModule} from 'ngx-popover'

// import { MetaModule } from 'ng2-meta'

// Raven
//   .config('https://2978499738d5454a8c9bdaa1bc5ae034@sentry.io/141702')
//   .install()

const appRoutes: Routes = [
  {
    canActivateChild: [MetaGuard],
    path: '',
    component: HomeComponent,
    data: {
      meta: {
        description: 'Description of the home page'
      }
    }
  },
  { path: 'list',
    component: ListingComponent,
    data: {
      meta: {
        description: 'Description of the home page'
      }
    }
  },
  { path: 'calendar',
    component: CalendarComponent
  },
  // { path: 'embed/:id', component: EmbedComponent},
  {
    path: 'event/:id',
    component: EventComponent
  },
  {
    path: 'item/:id',
    component: ItemComponent
  },
  {
    path: 'film/:slug',
    component: ItemComponent
  },
  {
    path: 'interactive/:slug',
    component: ItemComponent
  },
  {
    path: 'audio/:slug',
    component: ItemComponent
  },
  {
    path: 'node/:slug',
    component: ItemComponent
  },
  {
    path: 'resource/:slug',
    component: ItemComponent
  },
  {
    path: 'awards',
    component: ItemPageComponent
  },
  {
    path: 'team',
    component: ItemPageComponent
  },
  {
    path: 'partners',
    component: ItemPageComponent
  },
  {
    path: 'terms-and-conditions',
    component: PageComponent
  },
  {
    path: 'privacy-and-cookies',
    component: PageComponent
  },
  {
    path: 'about',
    component: PageComponent
  },
  {
    path: 'films',
    component: ListingComponent,
    data: [{filter: 'typeFilm', type: 'content types'}]
  },
  {
    path: 'lesson plans',
    component: ListingComponent,
    data: [{filter: 'typeLesson',
    type: 'content types'}]
  },
  {
    path: 'assembly scripts',
    component: ListingComponent,
    data: [{filter: 'typeAssembly',
    type: 'content types'}]
  },
  {
    path: 'interactive',
    component: ListingComponent,
    data: [{filter: 'typeInteractive',
    type: 'content types'}]
  },
  {
    path: 'me',
    component: ProfileComponent,
    canActivate: [LoggedInGuard],
    resolve: {
      profile: ProfileResolver
    }
  },
  {
    path: 'me/lists',
    component: UserListsComponent,
    canActivate: [LoggedInGuard],
    resolve: {
      profile: ProfileResolver
    }
  },
  {
    path: 'me/list/:id',
    component: UserListComponent,
    canActivate: [LoggedInGuard],
    resolve: {
      profile: ProfileResolver
    }
  },
  {
    path: 'rmcallback',
    component: RmAuthComponent
  }
]

// export class RavenErrorHandler implements ErrorHandler {
//   handleError(err: any): void {
//     Raven.captureException(err.originalError)
//   }
// }


export function metaFactory(): MetaLoader {
  return new MetaStaticLoader({
    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
    pageTitleSeparator: ' - ',
    applicationName: 'True Tube',
    defaults: {
      title: '',
      description: 'Award winning free resources for RE, PSHE and Citizenship'
    }
  })
}

@NgModule({
  declarations: [
    AccessibilityNavComponent,
    AppComponent,
    AttributePipe,
    AwardsComponent,
    CalendarComponent,
    CallToActionComponent,
    CarouselComponent,
    CookieNoticeComponent,
    EmbedMenuPipe,
    EventComponent,
    EventsBlockComponent,
    FooterComponent,
    FooterNavComponent,
    HeaderComponent,
    HomeComponent,
    HomeListingComponent,
    HomeSortComponent,
    ImagePipe,
    ItemComponent,
    ItemPageComponent,
    ItemListComponent,
    ListFilterComponent,
    ListingComponent,
    ListItemComponent,
    ListingSortComponent,
    PageComponent,
    PagesNavComponent,
    PaginationPipe,
    PartnersCarouselComponent,
    VideoComponent,
    AudioComponent,
    PrimaryNavComponent,
    ProfileComponent,
    QueryStringPipe,
    SanitiseUrlPipe,
    SearchComponent,
    TopicsComponent,
    UserListComponent,
    UserListsComponent,
    UserNavComponent,
    FeedbackComponent,
    RmAuthComponent
  ],
  imports: [
    // PopoverModule,
    BrowserModule,
    // ClipboardModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger'
    }),
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    MetaModule.forRoot({
      provide: MetaLoader,
      useFactory: (metaFactory)
    }),
    SwiperModule,
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ])
  ],
  providers: [
    AUTH_PROVIDERS,
    Auth,
    DataService,
    ListFilterComponent,
    ListingComponent,
    ListService,
    MetaService,
    LoggedInGuard,
    ProfileResolver,
    UserService    // {provide: ErrorHandler, useClass: RavenErrorHandler}
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
