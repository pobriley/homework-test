import React, { useState, useEffect } from "react";
import { Table, Container, Row, Button } from "reactstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";
import "../css/ProductList.css";
function ProductList() {
  const [product, setProduct] = useState([]);

  const updateProductData = () => {
    axios.get("http://localhost:5000/api/km_unit").then((respond) => {
      setProduct(respond.data);
      console.log("Update Product data list .....");
    });
  };

  useEffect(() => {
    updateProductData();
  }, []);

  const deleteProduct = (product) => {
    swal({
      title: "Do you want to delete " + product.km_name + " ?",
      text: "Once deleted, you will not be able to recover this prouct!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete("http://localhost:5000/api/km_unit/" + product.km_id)
          .then((response) => {
            console.log(response.data);
            updateProductData();
            swal("Poof! Your product has been deleted!", {
              icon: "success",
            });
          });
      } else {
        swal("Your product is safe!");
      }
    });
  };

  return (
    <Container className="content">
      <Row>
        <h2>รายละเอียดกิจกรรม</h2>
      </Row>
      <Row>
        <Table>
          <thead>
            <tr>
              <th>ชื่อเรื่อง</th>
              <th>รูปภาพ</th>
              <th className="td_kmGroup">หมวดหมู่</th>
              <th className="td_action">จัดการข้อมูล</th>
            </tr>
          </thead>
          <tbody>
            {product.map((product) => {
              return (
                <tr key={product.km_id}>
                  <td className="td_kmName">{product.km_name}</td>
                  <td>{product.km_pic}</td>
                  <td className="td_kmGroup">{product.km_group}</td>
                  <td className="td_action">
                    <Button color="warning" href={"edit/" + product._id}>
                      <FontAwesomeIcon icon={faEdit} /> แก้ไข
                    </Button>{" "}
                    <Button
                      color="danger"
                      onClick={() => {
                        deleteProduct(product);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} /> ลบ
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
}

export default ProductList;
