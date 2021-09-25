import { useState, useEffect } from "react";
// API
import API from "../API";
// Helpers
import { isPersistedState } from "../helpers";

const initialState = {
  page: 0,
  results: [],
  total_pages: 0,
  total_results: 0,
};

export const useHomeFetch = () => {
  // useState is a bit bit like setting global variable
  const [searchTerm, setSearchTerm] = useState("");
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  console.log(searchTerm);

  const fetchMovies = async (page, searchTerm = "") => {
    try {
      setError(false);
      setLoading(true);

      const movies = await API.fetchMovies(searchTerm, page);

      setState((prev) => ({
        ...movies, // because we are creating new object, basically appending things to "movies" so need to spread them out
        results:
          page > 1 ? [...prev.results, ...movies.results] : [...movies.results],
      }));
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  };

  // Initial and search
  useEffect(() => {
    // To make sure we dont check the session storage when we are doing a search
    if (!searchTerm) {
      const sessionState = isPersistedState("homeState");
      if (sessionState) {
        console.log("Grabbing from sessionStorage");
        setState(sessionState);
        return;
      }
    }
    console.log("Grabbing from API");
    setState(initialState);
    fetchMovies(1, searchTerm);
  }, [searchTerm]); // empty array -> it will only run once on the initial render/ on Mount - wirh searchTerm in it, meaning it will trigger everytime when the search term changes

  // Load More
  useEffect(() => {
    if (!isLoadingMore) return;
    fetchMovies(state.page + 1, searchTerm);
    setIsLoadingMore(false);
  }, [isLoadingMore, searchTerm, state.page]);

  // Write to sessionStorage
  useEffect(() => {
    if (!searchTerm) {
      sessionStorage.setItem("homeState", JSON.stringify(state));
    }
  }, [searchTerm, state]);

  return { state, loading, error, searchTerm, setSearchTerm, setIsLoadingMore };
};
