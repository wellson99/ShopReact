import { useState } from 'react'

import {useSignout} from '../Hooks/useSignout';
import { useAuthContext } from '../Hooks/useAuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useCartContext } from '../Hooks/useCartContext';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import InboxIcon from '@mui/icons-material/Inbox';
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import Badge from '@mui/material/Badge';
import { grey } from '@mui/material/colors';

// import { useCustomStyle } from '../Hooks/useCustomStyle';

const pages = [{name: "Home", route: "/"}, {name: "Products", route: "/products"}]
const settings = [
  {name: "Profile", route: "/user/profile"}, 
  {name: "Purchase", route: "/user/purchases"},
  {name: "Signout", route: ""}
]

export const NavBar = () => {
  const {signout} = useSignout()
  const {user} = useAuthContext()
  const {cart} = useCartContext()
  const navigate = useNavigate()
  // const style = useCustomStyle()

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const getDisplayNameInitials = () => {
    if(user.displayName.includes(" ")){
      let firstName =  user.displayName.split(" ")[0]
      let lastName =  user.displayName.split(" ")[1]
      return firstName.substr(0,1) + lastName.substr(0,1)
    }else{
      return user.displayName.substr(0,1)
    }
  }

  const handleOpenNavMenu = (e) => setAnchorElNav(e.currentTarget)

  const handleOpenUserMenu = (e) => setAnchorElUser(e.currentTarget)

  const handleCloseNavMenu = () => setAnchorElNav(null)

  const handleCloseUserMenu = (route) => {
    setAnchorElUser(null)
    if(route === "")  signout()
  };

  return(
    <AppBar position="sticky">
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          {/* XS size */}
          {(user && cart) && (
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
                <MenuIcon />
              </IconButton>
              <Menu id="menu-appbar" anchorOrigin={{vertical: 'bottom', horizontal: 'left',}} keepMounted anchorEl={anchorElNav}
                transformOrigin={{vertical: 'top', horizontal: 'left',}} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu}
                sx={{display: { xs: 'block', md: 'none' },}}
              >
                {pages.map((page, index) => (
                  <Link key={index} to={page.route} style={{textDecoration: "none"}}>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  </Link>
                ))}
              </Menu>
            </Box>
          )}
          <Box sx={{flexGrow:1, display:{xs:'flex', md:'none', alignItems:"center"}}}>
            <LocalMallRoundedIcon sx={{fontSize:28, mr:1}} />
            <Typography variant="h6" noWrap component="div">shopReact</Typography>
          </Box>


          {/* XS above size */}
          <Box sx={{mr:2, display:{xs: 'none', md: 'flex', alignItems:"center"}}}>
            <LocalMallRoundedIcon sx={{fontSize:28, mr:1}} />
            <Typography variant="h6" noWrap component="div">shopReact</Typography>
          </Box>
          {(user && cart) && (
            <>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page, index) => (
                  <Link key={index} to={page.route} style={{textDecoration: "none"}}>
                    <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
                      {page.name}
                    </Button>
                  </Link>
                ))}
              </Box>

              <Box sx={{flexGrow:0}}>
                <Tooltip title="View shopping cart">
                  <Badge badgeContent={cart.length} color="error" >
                    <Link to="/user/carts">
                      <ShoppingCartRoundedIcon sx={{fontSize:28, color:'#fff'}} />
                    </Link>
                  </Badge>
                </Tooltip>
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <Box onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Stack direction="row" spacing={2} sx={{display:"flex", alignItems:"center", flexWrap:"wrap", cursor:"pointer"}}> 
                      <Typography variant="body1" noWrap component="span" sx={{pl:4, display:{xs:'none', md:"flex"}}}>
                        {user.displayName}
                      </Typography>
                      {user.photoURL 
                        ?<Avatar alt={user.displayName} src={user.photoURL} sx={{width:38, height:38}} />
                        :<Avatar sx={{bgcolor:grey[50], width:38, height:38}}>
                          <Typography variant="subtitle1" noWrap component="span" color="#1976d2">
                            {getDisplayNameInitials()}
                          </Typography>
                        </Avatar>
                      }
                    </Stack>
                  </Box>
                </Tooltip>
                <Menu sx={{mt:'50px'}} anchorEl={anchorElUser} id="menu-appbar" anchorOrigin={{vertical: 'top', horizontal: 'right',}}
                  keepMounted transformOrigin={{vertical: 'top', horizontal: 'right',}} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                  {settings.map((setting, index) => (
                    <MenuList key={index} sx={{width: 230, maxWidth: '100%'}}>
                      <Link to={setting.route} style={{textDecoration: "none"}}>
                        <MenuItem onClick={() => handleCloseUserMenu(setting.route)}>
                          <ListItemIcon> <InboxIcon /> </ListItemIcon>
                          <ListItemText>{setting.name}</ListItemText>
                        </MenuItem>
                      </Link>
                    </MenuList>
                  ))}
                </Menu>
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}