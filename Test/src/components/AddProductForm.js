import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  FormText,
  Progress,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";


import * as yup from "yup";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";


import "../css/AddProductForm.css";
function AddProductForm() {
  const initProductState = {
    km_name: "",
    km_pic: "",
    km_group: "",
  };

  const [submited, setSubmited] = useState();
  const [progress, setProgress] = useState(0);

  const FILE_SIZE = 2000 * 1024;
  const SUPPORT_FORMATS = ["image/jpg", "image/jpeg", "image/png", "image/gif"];


  const uploadFileToFirebase = async (km_pic) => {

    const userId = "001";
    const timestamp = Math.floor(Date.now() / 100);
    const newName = userId + "_" + timestamp;


    const storageRef = ref(storage, `images/${newName}`);
    const uploadTask = uploadBytesResumable(storageRef, km_pic);

    
    await uploadTask.on(
      "state_changed",
      (snapshot) => {
        
        const uploadProgress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(uploadProgress);
      }, 

      (error) => {
        console.log(error);
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          saveProduct(downloadURL);
        });
      } 
    );
  };

 
  const formik = useFormik({
    initialValues: initProductState, 

    validationSchema: yup.object().shape({
      km_name: yup.string().required("กรุณากรอกชื่อกิจกรรม"),
      km_pic: yup
        .mixed()
        .test("fileSize", "ไฟล์รูปภาพมีขนาดใหญ่เกินไป", (km_pic) => {
          if (km_pic) {
            return km_pic?.size <= FILE_SIZE;
          } else {
            return true;
          }
        })
        .test("fileType", "อัพโหลดได้เฉพาะรูปภาพเท่านั้น", (km_pic) => {
          if (km_pic) {
            return SUPPORT_FORMATS.includes(km_pic?.type);
          } else {
            return true;
          }
        }),
      km_group: yup.string().required("กรุณากรอกหมวดหมู่กิจกรรม"),
    }),
    onSubmit: () => {
      if (formik.values.km_pic) {
        console.log("Uploading image ...");
        uploadFileToFirebase(formik.values.km_pic);
      } else {
        saveProduct("");
      }
    },
  });

 
  const saveProduct = (url) => {
  
    const param = {
      km_name: formik.values.km_name,
      km_pic: url,
      km_group: formik.values.km_group,
    };
 
    axios
      .post("http://localhost:5000/api/km_unit", param)
      .then((response) => {
        console.log(response.data);

        setSubmited(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const newProduct = () => {
  
    setSubmited(null);
  };

  return (
    <Container>
      <Row>
        <h3>เพิ่มกิจกรรม</h3>
        {submited ? (
          <>
            <Alert color="success">
              <FontAwesomeIcon icon={faCheck}> </FontAwesomeIcon> You have
              submited successfully !!
            </Alert>
            <Button className="btn btn-success" onClick={newProduct}>
              บันทึกข้อมูล
            </Button>
          </>
        ) : (
          <>
            <Form onSubmit={formik.handleSubmit}>
              <FormGroup>
                <Label for="ชื่อกิจกรรม">ชื่อกิจกรรม</Label>
                <Input
                  type="text"
                  name="km_name"
                  id="productName"
                  value={formik.values.km_name || ""}
                  onChange={formik.handleChange}
                  placeholder="กรอกชื่อกิจกรรม"
                />
                {formik.errors.km_name && formik.touched.km_name && (
                  <p className="error_validate_text">{formik.errors.km_name}</p>
                )}
              </FormGroup>

     
              <FormGroup>
                <Label for="หมวดหมู่">หมวดหมู่</Label>
                <Input
                  type="text"
                  name="km_group"
                  id="productName"
                  value={formik.values.km_group || ""}
                  onChange={formik.handleChange}
                  placeholder="กรอกหมวดหมู่กิจกรรม"
                />
                {formik.errors.km_group && formik.touched.km_group && (
                  <p className="error_validate_text">
                    {formik.errors.km_group}
                  </p>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="fileupload">รูปภาพกิจกรรม</Label>
                <Input
                  type="file"
                  name="km_pic"
                  onChange={(event) => {
                    formik.setFieldValue(
                      "km_pic",
                      event.currentTarget.files[0]
                    );
                  }}
                />
                <FormText color="muted">
                  รองรับเฉพาะไฟล์ภาพและขนาดต้องไม่เกิน 2Mb
                </FormText>
                {formik.errors.km_pic && formik.touched.km_pic && (
                  <p className="error_validate_text">{formik.errors.km_pic}</p>
                )}
                {progress != 0 && (
                  <Progress animated color="info" value={progress} max="100">
                    {progress} %
                  </Progress>
                )}
              </FormGroup>
              <Button className="btn btn-success">บันทึกข้อมูล</Button>
            </Form>
          </>
        )}
      </Row>
    </Container>
  );
}

export default AddProductForm;
