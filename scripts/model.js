import { async } from "regenerator-runtime";

import {
  DISCOVER_API_URL,
  POPULAR_MOVIES_API_URL,
  TRENDING_API_URL,
  POPULAR_TVS_API_URL,
  SEARCH_API_URL,
  SEARCH_TVS_API_URL,
} from "./config";

export const data = {
  movie: {},
  discoverMovies: [],
  popularMovies: [],
  trendingMovies: [],
  popularTVS: [],
  searchResults: [],
  pages: { currentUrl: "", pageResults: [], currentPage: 1 },
};

export const createDiscoverCards = async function (
  pageName = "home",
  pageNum = 1
) {
  try {
    let movieData;
    let obj;
    if (pageName === "home") {
      // Fetches the data
      movieData = await fetch(DISCOVER_API_URL + pageNum);
      // Sets the obj to which type of page has been clicked
      obj = "discoverMovies";
      // Sets the current URL to fetched URL
      data.pages.currentUrl = DISCOVER_API_URL;
    }
    if (pageName === "movies-pop") {
      movieData = await fetch(POPULAR_MOVIES_API_URL + pageNum);
      obj = "popularMovies";
      data.pages.currentUrl = POPULAR_MOVIES_API_URL;
    }
    if (pageName === "trending") {
      movieData = await fetch(TRENDING_API_URL + pageNum);
      obj = "trendingMovies";
      data.pages.currentUrl = TRENDING_API_URL;
    }
    if (pageName === "tvs-pop") {
      movieData = await fetch(POPULAR_TVS_API_URL + pageNum);
      obj = "popularTVS";
      data.pages.currentUrl = POPULAR_TVS_API_URL;
    }

    // Takes the response and convert it to JSON

    const res = await movieData.json();
    console.log(res);

    //Always Sets the current page to 1

    data.pages.currentPage = res.page;

    // Throws an error when the response fails

    if (!movieData.ok) throw new Error();

    // Returns an Object that contains only Image and Title

    data[obj] = res.results.map((data) => {
      return {
        title: data.title || data.name,
        img: data.poster_path,
      };
    });
  } catch (error) {
    console.error(error);
  }
};

export const createSearchResults = async function (searchVal) {
  try {
    // Fetches Search API
    const resultData = await fetch(SEARCH_API_URL + searchVal);
    const resultTVData = await fetch(SEARCH_TVS_API_URL + searchVal);
    const res = await resultData.json();
    const resTv = await resultTVData.json();

    const finalResults = res.results.concat(resTv.results);

    console.log(finalResults);

    if (!resultData.ok) throw new Error();

    data.searchResults = finalResults.map((data) => {
      return {
        title: data.title || data.name,
        img: data.poster_path,
      };
    });
  } catch (error) {
    console.log(error);
  }
};

export const createPageResults = async function (btnType) {
  try {
    // Decrement and increment the currentPage number
    if (btnType === "next") data.pages.currentPage++;
    if (btnType === "back") data.pages.currentPage--;

    console.log(data.pages.currentPage);

    // Fetches the data

    const pageData = await fetch(
      data.pages.currentUrl + data.pages.currentPage
    );
    const res = await pageData.json();

    // Returns when the response fails

    if (!pageData.ok) return;

    data.pages.pageResults = res.results.map((data) => {
      return {
        title: data.title || data.name,
        img: data.poster_path,
      };
    });
  } catch (error) {
    console.log(error);
  }
};
