import Paper from "@mui/material/Paper"
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import Visibility from '@mui/icons-material/Visibility';

import { PageHeader } from "../Components/pageHeader"

import { useGetDocs } from "../Hooks/useGet"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";

const headerTitle = "Purchase"
const headerDescription = "Browse all of your purchase here."

export const Purchases = () => {
  const {documents} = useGetDocs("Purchases")
  const [sortedPurchaseList, setSortedPurchaseList] = useState(null)
  
  useEffect(() => {
    if(documents){
      const sorted = documents.sort((x, y) => y.createdAt.toDate() - x.createdAt.toDate())
      setSortedPurchaseList(sorted)
    }
  }, [documents])

  const formatDate = (timestamp) => {
    const dateObj = new Date(timestamp.seconds * 1000) 
    const date = dateObj.toLocaleString(undefined, {day:"numeric", month:"short", year:"numeric"})
    const time = dateObj.toLocaleString(undefined, {hour12:true, hour:"numeric", minute:"numeric"})
    return `${date} at ${time}`
  }

  return (
    <Box sx={{my:3, mx:{xs:3, md:7, lg:10}}} >
      <PageHeader title={headerTitle} description={headerDescription} />

      <Grid container spacing={3} justifyContent="flex-start" alignItems="center" sx={{py:3}}>
        {sortedPurchaseList && sortedPurchaseList.map(purchase => (
          <Grid item xs={12} lg={6} key={purchase.id}>
            <Paper elevation={10} >
              <Box sx={{p:2}}>
                <Grid container sx={{pb:2}}>
                  <Grid item sx={{flexGrow:1}}>
                    <Typography variant="body1" component="span">Purchase - ID</Typography><br/>
                    <Typography variant="h6" component="span">{purchase.id}</Typography>
                  </Grid>
                </Grid>

                <Grid container sx={{pb:2}}>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body1" component="span">Purchase Price</Typography><br/>
                    <Typography variant="h6" component="span">RM {purchase.itemsTotal}</Typography>
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <Typography variant="body1" component="span">Purchase Date</Typography><br/>
                    {/* <Typography variant="h6" component="span">{purchase.createdAt.toDate().toString()}</Typography> */}
                    <Typography variant="h6" component="span">{formatDate(purchase.createdAt)}</Typography>
                  </Grid>
                </Grid>

                <Grid container sx={{pb:2}}>
                  <Grid item xs={12} md={4} sx={{pr:3}}>
                    <Typography variant="body1" component="span">Item(s) in Purchase</Typography><br/>
                    <Typography variant="h6" component="span">{purchase.cartItems.length} items</Typography>
                  </Grid>
                  <Grid item xs={12} md={4} sx={{pr:3}}>
                    <Typography variant="body1" component="span">Delivery Type</Typography><br/>
                    <Typography variant="h6" component="span">{purchase.delivery.type}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body1" component="span">Delivery Cost</Typography><br/>
                    <Typography variant="h6" component="span">RM {purchase.delivery.price}</Typography>
                  </Grid>
                </Grid>

                <Grid container justifyContent="center">
                  <Grid item xs={12} sm={9} md={5}>
                    <Link to={`/user/purchases/${purchase.id}`}>
                      <Button variant="contained" size="large" fullWidth startIcon={<Visibility />}>
                        View Purchase Details
                      </Button>
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}