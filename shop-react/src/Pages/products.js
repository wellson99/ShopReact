import { useGetDocs } from "../Hooks/useGet"
import { Link } from "react-router-dom"
import { useCartContext } from "../Hooks/useCartContext"
import { useEffect, useState } from "react"

import { PageHeader } from "../Components/pageHeader"

import Paper from "@mui/material/Paper"
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Rating from '@mui/material/Rating';

import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';

const headerTitle = "Products"
const headerDescription = "Browse all of the products here."
const itemsPerPageList = [6, 12, 24 ,48]
const sortByList = [
  {type: "priceDesc", label: "Price (Highest to Lowest)"},
  {type: "priceAsc", label: "Price (Lowest to Highest)"},
  {type: "reviewDesc", label: "Review (Highest to Lowest)"},
  {type: "reviewAsc", label: "Review (Lowest to Highest)"},
]

export default function Products() {
  const {documents} = useGetDocs("Products")
  const [products, setProducts] = useState([])
  const {addToCart} = useCartContext()

  const [currentPage, setCurrentPage] = useState(1)
  // const [itemsPerPage, setItemsPerPage] = useState(12)
  // const [listCount, setListCount] = useState(null)

  const [itemsPerPageHandler, setItemsPerPageHandler] = useState(null);
  const [itemsPerPageIndex, setItemsPerPageIndex] = useState(1);
  const openPerPage = Boolean(itemsPerPageHandler);
  const handleClick = (event) => {
    setItemsPerPageHandler(event.currentTarget);
  };
  const closeItemsPerPageHandler = () => {
    setItemsPerPageHandler(null);
  };

  const [sortByHandler, setSortByHandler] = useState(null);
  const [sortByIndex, setSortByIndex] = useState(null);
  const openSortBy = Boolean(sortByHandler);
  const handleSortBy = (event) => {
    setSortByHandler(event.currentTarget);
  };
  const closeSortByHandler = () => {
    setSortByHandler(null);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault()
    const productToAdd = {id: product.id, name: product.name, imgURL: product.imgURL, price: product.price, quantity: 1}
    addToCart(productToAdd)
  }

  useEffect(() => {
    if(documents) setProducts(documents)
  }, [documents])

  const last = currentPage * itemsPerPageList[itemsPerPageIndex]
  const first = last - itemsPerPageList[itemsPerPageIndex]
  var currentProducts = products.slice(first, last)
  const totalPageCount = Math.ceil(products.length / itemsPerPageList[itemsPerPageIndex])
  
  const paginate = (e, page) => {
    setCurrentPage(page)
    window.scrollTo({top:0, behavior:"smooth"})
  }
  
  const pageFirstProduct = () => {
    return first + 1
  }

  const pageLastProduct = () => {
    if(currentPage === totalPageCount){
      return products.length
    }else{
      return last
    }
  }

  const updateItemsPerPage = (index) => {
    setCurrentPage(1)
    closeItemsPerPageHandler()
    setItemsPerPageIndex(index)
  }

  const updateItemSortBy = (index) => {
    switch(index){
      case 0:
        currentProducts = products.sort((x, y) => y.price - x.price)
        setCurrentPage(1)
        closeSortByHandler()
        setSortByIndex(index)
        return
      case 1:
        currentProducts = products.sort((x, y) => x.price - y.price)
        setCurrentPage(1)
        closeSortByHandler()
        setSortByIndex(index)
        return
      case 2:
        currentProducts = products.sort((x, y) => y.rating - x.rating)
        setCurrentPage(1)
        closeSortByHandler()
        setSortByIndex(index)
        return
      case 3:
        currentProducts = products.sort((x, y) => x.rating - y.rating)
        setCurrentPage(1)
        closeSortByHandler()
        setSortByIndex(index)
        return
    }
  }

  return (
    <Box sx={{my:3, mx:{xs:3, lg:5, xl:10}}} >
      <PageHeader title={headerTitle} description={headerDescription} />

      {documents && (<>
        <Grid container justifyContent="space-between" alignItems="center" sx={{py:2}}>
          <Grid item>
            <Typography variant="h6" component="span" fontWeight={700}>There are {products.length} products in total.</Typography>
            <br/>
            <Typography variant="body1" component="span">Currently displaying products {pageFirstProduct()} to {pageLastProduct()}.</Typography>
          </Grid>
          <Grid item>
            <Stack spacing={2} direction="row">
              <Button color="primary" variant="contained" startIcon={<ArrowDropDownRoundedIcon/>} onClick={handleClick}
                aria-controls={openPerPage ?'itp-menu' :undefined} aria-haspopup="true" aria-expanded={openPerPage ?'true' :undefined}>{itemsPerPageList[itemsPerPageIndex]} Items Per Page</Button>
              <Menu id="itp-menu" anchorEl={itemsPerPageHandler} open={openPerPage} onClose={closeItemsPerPageHandler} MenuListProps={{'aria-labelledby': 'basic-button'}}
                anchorOrigin={{vertical:'top', horizontal:'right'}} transformOrigin={{vertical:'top', horizontal:'right'}} sx={{mt:5}}>
                {itemsPerPageList.map((count, index) => (
                  <MenuItem key={index} disabled={index === itemsPerPageIndex} onClick={() => updateItemsPerPage(index)}>{count} items per page</MenuItem>
                ))}
              </Menu>

              <Button color="primary" variant="contained" startIcon={<ArrowDropDownRoundedIcon/>} onClick={handleSortBy}
                aria-controls={openSortBy ?'st-menu' :undefined} aria-haspopup="true" aria-expanded={openSortBy ?'true' :undefined}>Sort Items By</Button>
              <Menu id="st-menu" anchorEl={sortByHandler} open={openSortBy} onClose={closeSortByHandler} MenuListProps={{'aria-labelledby': 'basic-button'}}
                anchorOrigin={{vertical:'top', horizontal:'right'}} transformOrigin={{vertical:'top', horizontal:'right'}} sx={{mt:5}}>
                {sortByList.map((sortBy, index) => (
                  <MenuItem key={index} disabled={index === sortByIndex} onClick={() => updateItemSortBy(index)}>{sortBy.label}</MenuItem>
                ))}
              </Menu>

              {/* <Button color="primary" variant="contained" startIcon={<ArrowDropDownRoundedIcon/>}>Sort Items By</Button> */}
            </Stack>
          </Grid>
        </Grid>

        <Grid container spacing={3} justifyContent="flex-start" alignItems="center" >
          {currentProducts.map(product => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={product.id} sx={{my:1}}>
              <Link to={`/products/${product.id}`} state={{product:product}} style={{textDecoration:"none"}}>
                <Paper elevation={10} >
                  <Box sx={{p:1}}>
                    <Avatar variant="square" alt={product.name} src={product.imgURL} sx={{width:"100%", height:230}} />
                    <Divider sx={{my:1}}/>
                    <Stack>
                      <Box>
                        <Typography variant="body1" component="span" fontWeight={700}>{product.name}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body1" component="span" fontWeight={500}>RM {product.price.toFixed(2)}</Typography>
                      </Box>
                      <Box sx={{pb:1}}>
                        <Stack direction="row">
                          <Rating name="read-only" size="small" value={product.rating} readOnly precision={0.1} color="primary" />
                          <Typography variant="body2" component="span" sx={{ml:1}}>({product.rating})</Typography>
                        </Stack>
                      </Box>
                      <Box>
                        <Typography variant="body2" component="span" >{product.description.slice(0,180)}...</Typography>
                      </Box>
                    </Stack>

                    <Box sx={{mt:2, mb:1, textAlign:"center"}}>
                      <Button color="primary" variant="contained" startIcon={<AddShoppingCartRoundedIcon/>} 
                        sx={{width:"90%"}} onClick={(e) => handleAddToCart(e, product)}>
                        Add To Cart
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Link>
            </Grid>
          ))}
        </Grid>
        <Pagination count={totalPageCount} page={currentPage} onChange={(e, page) => paginate(e, page)} variant="outlined" shape="rounded" />
      </>)}
    </Box>
  )
}