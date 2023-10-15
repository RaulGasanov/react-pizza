import React, { useContext, useEffect, useState } from 'react';
import Categories from '../components/Categories';
import Sort from '../components/Sort';
import Skeleton from '../components/PizzaBlock/Skeleton';
import PizzaBlock from '../components/PizzaBlock/PizzaBlock';
import Pagination from '../components/Pagination/Pagination';
import { SearchContext } from '../App';

const Home = () => {
   const { searchValue } = useContext(SearchContext);
   const [items, setItems] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [categoryId, setCategoryId] = useState(0);
   const [currentPage, setCurrentPage] = useState(1);
   const [sortType, setSortType] = useState({
      name: 'популярности',
      sortProperty: 'rating',
   });

   useEffect(() => {
      setIsLoading(true);
      const category = categoryId > 0 ? `category=${categoryId}` : '';
      const sortBy = sortType.sortProperty.replace('-', '');
      const order = sortType.sortProperty.includes('-') ? 'desc' : 'asc';
      const search = searchValue ? `&search=${searchValue}` : '';

      fetch(
         `https://64f4c0fe932537f4051aab5e.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}&${search}`,
      )
         .then((res) => res.json())
         .then((arr) => {
            setItems(arr);
            setIsLoading(false);
         });
      window.scrollTo(0, 0);
   }, [categoryId, sortType, searchValue, currentPage]);

   const pizzas = items.map((obj) => <PizzaBlock key={obj.id} {...obj} />);
   const skeletons = [...new Array(10)].map((_, index) => <Skeleton key={index} />);

   return (
      <div className="container">
         <div className="content__top">
            <Categories value={categoryId} onChangeCategory={(i) => setCategoryId(i)} />
            <Sort value={sortType} onChangeSort={(i) => setSortType(i)} />
         </div>
         <h2 className="content__title">Все пиццы</h2>
         <div className="content__items">{isLoading ? skeletons : pizzas}</div>
         <Pagination onChangePage={(number) => setCurrentPage(number)} />
      </div>
   );
};

export default Home;