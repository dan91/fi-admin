

// export const BlogPostList: React.FC<IResourceComponentsProps> = () => {
//   return (
//     <AntdListInferencer
//       fieldTransformer={(field) => {
//         if (["$permissions", "$updatedAt", "$createdAt"].includes(field.key)) {
//           return false;
//         }
//         return field;
//       }}
//     />
//   );
// };

import {
    useTranslate,
    IResourceComponentsProps,
    CrudFilters,
    HttpError,
    getDefaultFilter,
} from "@refinedev/core";
import { useSimpleList, CreateButton, useDrawerForm } from "@refinedev/antd";
import { SearchOutlined } from "@ant-design/icons";
import { Row, List as AntdList, Col, Form, Input, Typography } from "antd";

import {
    ExperimentItem,
    ProductCategoryFilter,
    // CreateProduct,
    // EditProduct,
} from "../../components/product";
import { IExperiment } from "../../interfaces";
import { ExperimentCreate } from "./create";

const { Text } = Typography;

export const ExperimentList: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();

    const { listProps, searchFormProps, filters } = useSimpleList<
        IExperiment,
        HttpError,
        { name: string; categories: string[] }
    >({
        pagination: { pageSize: 12, current: 1 },
        // onSearch: ({ name, categories }) => {
        //     const productFilters: CrudFilters = [];

        //     productFilters.push({
        //         field: "category.id",
        //         operator: "in",
        //         value: categories?.length > 0 ? categories : undefined,
        //     });

        //     productFilters.push({
        //         field: "name",
        //         operator: "contains",
        //         value: name ? name : undefined,
        //     });

        //     return productFilters;
        // },
    });



    return (
        <div>
            <Form
                {...searchFormProps}
                onValuesChange={() => {
                    searchFormProps.form?.submit();
                }}
                initialValues={{
                    name: getDefaultFilter("name", filters, "contains"),
                    categories: getDefaultFilter("category.id", filters, "in"),
                }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={18}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                                gap: "8px",
                                marginBottom: "16px",
                            }}
                        >
                            <Text style={{ fontSize: "24px" }} strong>
                                {t("products.products")}
                            </Text>
                            <Form.Item name="name" noStyle>
                                <Input
                                    style={{
                                        width: "400px",
                                    }}
                                    placeholder={t("stores.productSearch")}
                                    suffix={<SearchOutlined />}
                                />
                            </Form.Item>
                            <CreateButton>
                                {t("stores.buttons.addProduct")}
                            </CreateButton>
                        </div>
                        <AntdList
                            grid={{
                                gutter: 8,
                                xs: 1,
                                sm: 1,
                                md: 1,
                                lg: 1,
                                xl: 2,
                                xxl: 2,
                            }}
                            style={{
                                height: "100%",
                                overflow: "auto",
                                paddingRight: "4px",
                            }}
                            {...listProps}
                            renderItem={(item) => (
                                <ExperimentItem item={item} />
                            )}
                        />
                    </Col>
                    {/* <Col xs={0} sm={6}>
                      <div
                          style={{
                              display: "flex",
                              alignItems: "center",
                              height: "40px",
                              marginBottom: "16px",
                          }}
                      >
                          <Text style={{ fontWeight: 500 }}>
                              {t("stores.tagFilterDescription")}
                          </Text>
                      </div>
                      <Form.Item name="categories">
                          <ProductCategoryFilter />
                      </Form.Item>
                  </Col> */}
                </Row>
            </Form>

            {/* <EditProduct 
              drawerProps={editDrawerProps}
              formProps={editFormProps}
              saveButtonProps={editSaveButtonProps}
              editId={editId}
          /> */}
        </div>
    );
};
