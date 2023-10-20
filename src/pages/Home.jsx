import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Categories from '../components/Categories';
import Sort, { list } from '../components/Sort';
import Skeleton from '../components/PizzaBlock/Skeleton';
import PizzaBlock from '../components/PizzaBlock/PizzaBlock';
import Pagination from '../components/Pagination/Pagination';
import { SearchContext } from '../App';
import { useSelector, useDispatch } from 'react-redux';
import { setCategoryId, setCurrentPage, setFilters } from '../redux/slices/filterSlice';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';

const Home = () => {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const isSearch = useRef(false);
   const { categoryId, sort, currentPage } = useSelector((state) => state.filter);

   const { searchValue } = useContext(SearchContext);
   const [items, setItems] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   const onChangeCategory = (id) => {
      dispatch(setCategoryId(id));
   };

   const onChangePage = (number) => {
      dispatch(setCurrentPage(number));
   };

   const fetchPizzas = () => {
      setIsLoading(true);
      const category = categoryId > 0 ? `category=${categoryId}` : '';
      const sortBy = sort.sortProperty.replace('-', '');
      const order = sort.sortProperty.includes('-') ? 'desc' : 'asc';
      const search = searchValue ? `&search=${searchValue}` : '';

      axios
         .get(
            `https://64f4c0fe932537f4051aab5e.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}&${search}`,
         )
         .then((res) => {
            setItems(res.data);
            setIsLoading(false);
         });
   };

   // localStorage
   useEffect(() => {
      if (window.location.search) {
         const params = qs.parse(window.location.search.substring(1));
         const sort = list.find((obj) => obj.sortProperty === params.sortProperty);

         dispatch(
            setFilters({
               ...params,
               sort,
            }),
         );
         isSearch.current = true;
      }
   }, []);

   useEffect(() => {
      window.scrollTo(0, 0);

      if (!isSearch.current) {
         fetchPizzas();
      }

      isSearch.current = false;
   }, [categoryId, sort.sortProperty, searchValue, currentPage]);

   useEffect(() => {
      const queryString = qs.stringify({
         sortProperty: sort.sortProperty,
         categoryId,
         currentPage,
      });

      navigate(`?${queryString}`);
   }, [categoryId, sort.sortProperty, currentPage]);

   const pizzas = items.map((obj) => <PizzaBlock key={obj.id} {...obj} />);
   const skeletons = [...new Array(10)].map((_, index) => <Skeleton key={index} />);

   return (
      <div className="container">
         <div className="content__top">
            <Categories value={categoryId} onChangeCategory={(i) => onChangeCategory(i)} />
            <Sort />
         </div>
         <h2 className="content__title">Все пиццы</h2>
         <div className="content__items">{isLoading ? skeletons : pizzas}</div>
         <Pagination currentPage={currentPage} onChangePage={onChangePage} />
      </div>
   );
};

export default Home;
