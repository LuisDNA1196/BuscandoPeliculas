import { useRef, useState, useMemo, useCallback } from 'react'
import { searchMovies } from '../services/movies'
//import withoutResults from '../mocks/withoutResults.json'
//import withResults from '../mocks/withResults.json'
//useMemo memoriza un valor 
//useCallback parecido a usememo, especial poara funciones

export function useMovies ({ search, sort }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [, setError] = useState(null)
  const previousSearch = useRef(search) //no se vuelve a renderizar

  const getMovies = useCallback (async({ search }) => {
      if (search === previousSearch.current) return 
      //search es ''
    try{
      setLoading(true)
      setError(null)
      previousSearch.current = search
      const newMovies = await searchMovies ({ search })
      setMovies(newMovies)
    } catch (e) {
      setError(e.message)
    } finally {
      //finally ocurre en try y en catch 
      setLoading(false)
    }
}, [])

const sortedMovies = useMemo(() => {
  if (!movies) return;
return sort
? [...movies].sort((a, b) => a.title.localeCompare(b.title))
: movies
}, [sort, movies])
  // const [responseMovies, setResponseMovies] = useState([])

  //   const movies = responseMovies.Search 
  
  //   const mappedMovies = movies?.map(movie =>({
  //     id: movie.imdbID,
  //     title: movie.Title,
  //     year: movie.Year,
  //     poster: movie.Poster
  //   }))

  //   const getMovies = () => {
  //     if(search){
  //      //setResponseMovies(withResults) 
  //      fetch(`https://www.omdbapi.com/?apikey=df5f70f9&s=${search}`)
  //      .then(res => res.json())
  //      .then(json => {
  //       setResponseMovies(json)
  //      })
  //     }else{
  //       setResponseMovies(withoutResults)
  //     }
  //   }

  //   return {movies: mappedMovies, getMovies}


  return{movies: sortedMovies, getMovies, loading}
}