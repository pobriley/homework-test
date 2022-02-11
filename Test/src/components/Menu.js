import React, { useState, useEffect } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import axios from "axios";
import "../css/Menu.css";
function Menu() {
  const [isOpen, setIsOPen] = useState(false);
  const toggle = () => setIsOPen(!isOpen);
  const [group, setGroup] = useState([]);
  //ดึง data

  const updateGroupData = () => {
    axios.get("http://localhost:5000/api/group_project").then((respond) => {
      setGroup(respond.data);
      console.log(respond.data);
    });
  };

  useEffect(() => {
    updateGroupData();
  }, []);

  return (
    <Navbar
      className="navbar navbar-expand-md navbar-dark fixed-top bg-dark"
      expand="md"
    >
      <NavbarBrand href="/">หน้าหลัก</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="mr-auto " navbar>
          <NavItem>
            <NavLink href="/">รายละเอียดกิจกรรมทั้งหมด</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/add">เพิ่มข้อมูลกิจกรรม</NavLink>
          </NavItem>
          <UncontrolledDropdown inNavbar nav>
            <DropdownToggle caret nav>
              หมวดหมู่
            </DropdownToggle>
            <DropdownMenu right>
              {group.map((group) => {
                return <DropdownItem>{group.group_name}</DropdownItem>;
              })}
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Collapse>
    </Navbar>
  );
}

export default Menu;
