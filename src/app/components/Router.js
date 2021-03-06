//vendor
import Swiper, { Navigation, Pagination } from 'swiper/core';
Swiper.use([Navigation, Pagination]);

//helpers
import { ajax } from "../helpers/ajax.js";
import api from "../helpers/TMDb-api.js";
import genresList from "../helpers/genresList";
import { infiniteScroll } from "../helpers/infinite_scroll";

//components
import { Header } from "./Header";
import { MoviePosterCard } from "./MoviePosterCard.js";
import { SwiperConfiguration } from "../helpers/SwiperConfiguration.js";
import { SliderSection } from "./SliderSection.js";
import { SearchForm } from "./SearchForm.js";
import { MovieDetailsSection } from "./MovieDetailsSection.js";
import { ResultsSection } from "./ResultsSection";
import { PersonDescriptionSection } from "./PersonDescriptionSection.js";
import { PersonDetailsSection } from "./PersonDetailsSection.js";
import { PageNotFound } from "./PageNotFound";

export async function Router() {
     window.scrollTo(0,0)
     api.page = 1;

     const d = document,
          w = window,
          $root = document.getElementById("root"),
          $main = d.getElementById("main"),
          $fragment = d.createDocumentFragment(),
          $title = d.querySelector("title");

     let { hash } = location;

     $main.appendChild( SearchForm() );
     $title.innerText = "Movie App";

     let movieViewRegEx = /#\/movie\/[0-9]+\/[a-z0-9-]+/,
          personViewRegEx = /#\/person\/[0-9]+\/[a-z0-9-]+/,
          genreViewRegEx = /#\/genre\/[0-9]+\/[A-Za-z0-9-]+/,
          searchViewRegEx = /#\/search\?q\=[A-Za-z0-9-#!%]+/;

     // http://domainName.ext/# || http://domainName.ext/
     if (!hash || hash === "#/" ) {
          await ajax({
               url: [
                    api.TRENDING,
                    api.POPULAR,
                    api.GENRES,
                    `${api.POPULAR}&with_genres=28`,
               ],
               cbSuccess: async (data) => {
                    const trendingMovies = data[0].results,
                         popularMovies = data[1].results,
                         popularActionMovies = data[3].results,
                         genresList = data[2].genres;
                    
                    const $trendingSection = SliderSection({
                              title: "Trending today",
                              SlidesComponent: MoviePosterCard,
                              slidesData: trendingMovies,
                              linkExploreAll: "#/trending",
                              sliderClass: 'trending'
                         }),
                         $popularSection = SliderSection({
                              title: "Popular Movies",
                              SlidesComponent: MoviePosterCard,
                              slidesData: popularMovies,
                              linkExploreAll:  "#/popular",
                              sliderClass: 'movies'
                         }),
                         $popularCategorySection = SliderSection({
                              title: "Browse by category:",
                              SlidesComponent: MoviePosterCard,
                              slidesData: popularActionMovies,
                              sliderClass: 'browse-category',
                              changeSlidersButtonsData:  genresList,
                              linkExploreAll:  "#/genre/28/Action",
                         });

                    $fragment.appendChild( await Header( popularMovies[0]) );
                    $fragment.appendChild( $trendingSection );
                    $fragment.appendChild( $popularSection );
                    $fragment.appendChild( $popularCategorySection );

                    $main.appendChild($fragment);

                    let swiper = new Swiper(".swiper-container", {
                         slidesPerView: 1,
                         spaceBetween: 7,
                         breakpoints: {
                              320: {
                                   slidesPerView: 2,
                                   spaceBetween: 7
                              },
                              480: {
                                   slidesPerView: 3,
                                   spaceBetween: 7
                              },
                              640: {
                                   slidesPerView: 4,
                                   spaceBetween: 7
                              },
                              1024: {
                                   slidesPerView: 5,
                                   spaceBetween: 7,
                              }
                         },
                         pagination: {
                              el: '.swiper-pagination',
                              clickable: true,
                         },
                         navigation: {
                              nextEl: '.swiper-button-next',
                              prevEl: '.swiper-button-prev',
                         },
                    });
                    SwiperConfiguration();
               }
          });
     }
     // http://domainName.ext/#/movie/movie-id/movie-name
     // http://localhost:8080/#/movie/527774/raya-and-the-last-dragon
     else if(movieViewRegEx.test(hash)){
          const movieId = hash.split("/")[2];
          await ajax({
               url: [
                    `${api.MOVIE}/${movieId}${api.appendVideosImagesCast}`,
                     `${api.MOVIE}/${movieId}/similar`
               ],
               cbSuccess: async (data) => {
                    const currentMovie = data[0],
                         similarMovies = data[1].results;

                    const $movieDetailsSection = MovieDetailsSection(currentMovie);

                    $title.innerText = currentMovie.title + " - Movie App";
                    $fragment.appendChild( await Header( currentMovie ) );
                    $fragment.appendChild($movieDetailsSection);

                    if(similarMovies.length > 0) {
                         const $moreLikeThisSection = SliderSection({
                              title: "More Like This",
                              SlidesComponent: MoviePosterCard,
                              slidesData: similarMovies,
                              sliderClass: 'more-like-this'
                         });
                         $fragment.appendChild( $moreLikeThisSection );
                    }

                    $main.appendChild($fragment);

                    let swiper = new Swiper(".swiper-container", {
                         slidesPerView: 1,
                         spaceBetween: 7,
                         breakpoints: {
                              320: {
                                   slidesPerView: 2,
                                   spaceBetween: 7
                              },
                              480: {
                                   slidesPerView: 3,
                                   spaceBetween: 7
                              },
                              640: {
                                   slidesPerView: 4,
                                   spaceBetween: 7
                              },
                              1024: {
                                   slidesPerView: 5,
                                   spaceBetween: 7,
                              }
                         },
                         pagination: {
                              el: '.swiper-pagination',
                              clickable: true,
                         },
                         navigation: {
                              nextEl: '.swiper-button-next',
                              prevEl: '.swiper-button-prev',
                         },
                    });
                    SwiperConfiguration();
               }
          })
     }
     // http://domainName.ext/#/genre/genre-id/genre-name
     // http://localhost:8080/#/genre/12/Adventure
     else if(genreViewRegEx.test(hash)){
          const genreId = hash.split("/")[2],
               genreName = genresList.find(genre => genre.id == genreId).name;
          $title.innerText = genreName + "  - Movie App";
          await ajax({
               url: `${api.POPULAR}${api.withGenres}${genreId}`,
               cbSuccess: async (data) => {
                    const $resultsSection = ResultsSection({
                         title: `Movie Genre: ${decodeURIComponent(genreName)}`,
                         results: data.results,
                         page: data.page,
                         searchFormIsActive: false,
                         totalResults: data.total_results,
                    });
                   $fragment.appendChild( $resultsSection );
                    $main.appendChild($fragment);
                    api.total_pages = data.total_pages;
                    api.infinite_url= `${api.POPULAR}${api.withGenres}${genreId}`
                    infiniteScroll();
               }
          })
     }
     // http://domainName.ext/#/person/person-id/person-name
     // http://localhost:8080/#/person/6944/octavia-spencer
     else if(personViewRegEx.test(hash)){
          const personId = hash.split("/")[2];
          await ajax({
               url: [
                    `${api.PERSON}/${personId}`,
                    `${api.PERSON}/${personId}/movie_credits?sort_by=popularity.desc`,
                    `${api.PERSON}/${personId}/images`
               ],
               cbSuccess: (data) => {
                    const biography = data[0],
                         movieCredits = data[1],
                         images = data[2];
                    
                    $title.innerText = biography.name + " - Movie App";

                    const $personDescriptionSection = PersonDescriptionSection(biography),
                         $PersonDetailsSection = PersonDetailsSection({movieCredits, images});

                    $fragment.appendChild( $personDescriptionSection );
                    $fragment.appendChild( $PersonDetailsSection );
                    $main.appendChild($fragment);
                    api.total_pages = -1;
               }
          })
     }
     // http://domainName.ext/#/search?q=movie-title
     // http://localhost:8080/#/search?q=pokemon
     else if(searchViewRegEx.test(hash)){
          $title.innerText = "Search - Movie App"
          const keyWord = hash.slice(hash.indexOf("?q=")+3, hash.length);
          await ajax({
               url: `${api.SEARCH}${keyWord}`,
               cbSuccess: async (data) => {
                    const $resultsSection = ResultsSection({
                         title: `Search For: ${decodeURIComponent(keyWord)}`,
                         keyWord: decodeURIComponent(keyWord),
                         results: data.results,
                         page: data.page,
                         searchFormIsActive: true,
                         totalResults: data.total_results,
                    });
                   $fragment.appendChild( $resultsSection );
                    $main.appendChild($fragment);
                    api.total_pages = data.total_pages;
                    api.infinite_url = `${api.SEARCH}${keyWord}`
                    infiniteScroll();
               }
          })
     }
     else {
          $title.innerText = "This page could not be found - Movie App"
          $main.insertAdjacentElement("beforeend",PageNotFound({
               title: "This page could not be found",
               message: "Looks like you've followed a broken link or entered a URL that doesn't exist on this site.",
               backHome: true
          }))
     }

     d.querySelector(".loader-container").style.display = "none";
}
