import './App.css'
import { Movies } from './components/Movies'
import { useCallback, useEffect, useRef, useState, } from 'react'
import { useMovies } from './hooks/useMovies'
import debounce from 'just-debounce-it'
//import { useRef } from 'react'
//Hook permite crear referencia mutable que persiste en todo el ciclo de vida del componente, guardar cualquier valor que se pueda mutar, un elemneto del DOM, un contador, cada vez que cambia no vuelve a rederizar el componente al contrario que useState que siempre que cambia tambien actualiza el componente, su valor no es reiniciado. Tambien guardar referencias de un evento del DOM.

//customHook
function useSearch () {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)
  const isFirstInput = useRef(true)

  useEffect(()=>{
    if(isFirstInput.current){ //flag
      isFirstInput.current = search === '' //true
      return
    }
    if (search === ''){
      setError('No se puede buscar pelicula vacia')
      return
    }
    if (search.match(/^\d+$/)){
      setError('No se puede buscar pelicula con Numero')
      return
    }
    if (search.length < 3){
      setError('Busqueda debe tener al menos 3 caracteres')
      return
    }

    setError(null)
  },[search])

  return { search, updateSearch, error }
}

function App() {
  const [sort, setSort] = useState (false)
  const {search, error, updateSearch} = useSearch()
  const { movies, loading, getMovies } = useMovies({ search, sort })
  

  // console.log('render');
  // const counter = useRef(0) //valor que persiste entre renders
  // counter.current++
  // console.log(counter.current);

  const debouncedGetMovies = useCallback(
    debounce(search => {
      console.log('search', search)
      getMovies({ search })
    }, 300)
    , [getMovies]
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies({ search })
    }
    // const fields = Object.fromEntries(
    //   new window.FormData(event.target)
    // )
    // console.log(fields);
    
    // if (query !== ''){ //manejo de errores
    //   setError('No se encontro pelicula')
  // }
  // const inputElement = inputRef.current
  //const value = inputElement.value
  //console.log(value);

  const handleChange = (event) => {
    //cambio en input hara busqueda
    const newSearch = event.target.value
    updateSearch(newSearch)
    debouncedGetMovies(newSearch) 
  }

  const handleSort = () =>{
    setSort(!sort)
  }

  // useEffect(()=>{
  //   console.log('new movies');
  // },[getMovies])

  return (
    <>
    <div className='page'>
      <header > 
        <h1>Buscador de peliculas</h1>
        <form className='form' onSubmit={handleSubmit} >
          <input 
          style={{
            border: '1px solid transparent',
            borderColor: error ? 'red' : 'transparent'
          }}
          onChange={handleChange} value={search} name='query' type='text' placeholder='Avenger, starwars, Matrix...' /> 
          {/* <input name='query2' type='text' placeholder='Avenger, starwars, Matrix...' /> 
          <input name='query3' type='text' placeholder='Avenger, starwars, Matrix...' />  */}
          {/*ref={inputRef}*/} 
          {/* Default de input es text y de button es submit */}
          <button  type='submit'>Buscar</button>
          <input type='checkbox' onChange={handleSort} checked={sort}/>
        </form>
        {error && <p className='error'>{error}</p>}
      </header>

      <main>
        {
          loading ? <p>Cargando...</p> : <Movies movies= { movies }/>
        }
      </main>
    </div>
    </>
  )
}

export default App
