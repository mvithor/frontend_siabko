import React from 'react';
import Menuitems from './MenuItems'; // Import menu
import MenuitemsSiswa from './MenuItemsSiswa'; // Import menu siswa
import MenuitemsGuru from './MenuItemsGuru'; // Import menu guru
import MenuitemsWaliSiswa from './MenuItemsWaliSiswa'; // Import menu wali siswa
import { useLocation } from 'react-router';
import { Box, List, useMediaQuery } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMobileSidebar } from 'src/store/customizer/CustomizerSlice';
import NavItem from './NavItem';
import NavCollapse from './NavCollapse';
import NavGroup from './NavGroup/NavGroup';

const SidebarItems = () => {
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf('/'));
  const customizer = useSelector((state) => state.customizer);
  const user = useSelector((state) => state.user); // Ambil user dari Redux store
  const role = user ? user.role : ''; // Ambil role dari user
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
  const dispatch = useDispatch();

  // Pilih menu items berdasarkan user role
  let menuItems;
  switch (role) {
    case 'admin':
      menuItems = Menuitems;
      break;
    case 'siswa':
      menuItems = MenuitemsSiswa;
      break;
    case 'guru':
      menuItems = MenuitemsGuru;
      break;
      case 'wali siswa':
      menuItems = MenuitemsWaliSiswa;
        break;
    default:
      menuItems = []; // Kosongkan menu items jika role tidak dikenali
      break;
  }

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {menuItems.map((item, index) => {
          if (item.subheader) {
            return <NavGroup item={item} hideMenu={hideMenu} key={item.subheader} />;
          } else if (item.children) {
            return (
              <NavCollapse
                menu={item}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                pathWithoutLastPart={pathWithoutLastPart}
                level={1}
                key={item.id}
                onClick={() => dispatch(toggleMobileSidebar())}
              />
            );
          } else {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                onClick={() => dispatch(toggleMobileSidebar())}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};

export default SidebarItems;