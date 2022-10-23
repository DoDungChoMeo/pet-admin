import { useRef, useEffect } from 'react';
import {
  Form,
  Row,
  Col,
  Select,
  Button,
  Input,
  InputNumber,
  Typography,
} from 'antd';
import { PlusCircleOutlined, CloseOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useFirestoreCollection } from '~/hooks';
const { Option } = Select;

function DynamicFormList() {
  const [sizes, sizesLoading] = useFirestoreCollection('sizes');
  const [colors, colorsLoading] = useFirestoreCollection('colors');
  const [weights, weightsLoading] = useFirestoreCollection('weights');
  const addFirstFormItem = useRef();
  useEffect(() => {
    addFirstFormItem.current();
  }, []);

  return (
    <Container>
      <Form.List name="inventories">
        {(fields, { add, remove }) => {
          addFirstFormItem.current = (() => {
            let executed = false;
            return () => {
              if (!executed) {
                executed = true;
                add();
              }
            };
          })();

          return (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Row key={key} gutter={[20, 0]} className="form-list-group">
                  <CloseOutlined
                    className="form-list-close-button"
                    onClick={() => remove(name)}
                  />
                  <Col span={24}>
                    <Typography.Title level={5}>
                      <span>Nhóm phân loại </span>
                      <span>{index + 1}</span>
                    </Typography.Title>
                  </Col>
                  <Col span={24} md={12} lg={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'size']}
                      label="kích thước"
                      rules={[
                        { required: true, message: 'Không được để trống ô' },
                      ]}
                    >
                      <Select placeholder="Vui lòng chọn">
                        <Option key="dang-cap-nhat" value="Đang cập nhật">
                          Đang cập nhật
                        </Option>
                        {sizes.map((size) => (
                          <Option key={size.id} value={size.v}>
                            {size.v}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24} md={12} lg={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'color']}
                      label="màu sắc"
                      rules={[
                        { required: true, message: 'Không được để trống ô' },
                      ]}
                    >
                      <Select placeholder="Vui lòng chọn">
                        <Option key="dang-cap-nhat" value="Đang cập nhật">
                          Đang cập nhật
                        </Option>
                        {colors.map((color) => (
                          <Option key={color.id} value={color.v}>
                            {color.v}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24} md={12} lg={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'weights']}
                      label="Khối lượng"
                      rules={[
                        { required: true, message: 'Không được để trống ô' },
                      ]}
                    >
                      <Select placeholder="Vui lòng chọn">
                        <Option key="dang-cap-nhat" value="Đang cập nhật">
                          Đang cập nhật
                        </Option>
                        {weights.map((weights) => (
                          <Option key={weights.id} value={weights.v}>
                            {weights.v}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={24} md={12} lg={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'price']}
                      label="giá bán"
                      rules={[
                        {
                          required: true,
                          message: 'Không được để trống',
                        },
                      ]}
                    >
                      <InputNumber
                        placeholder="Nhập vào"
                        min={0}
                        style={{ width: '100%' }}
                        prefix="₫"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24} md={12} lg={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'stock']}
                      label="số lượng thêm vào kho"
                      rules={[
                        {
                          required: true,
                          message: 'Không được để trống',
                        },
                      ]}
                    >
                      <InputNumber
                        placeholder="Nhập vào"
                        min={0}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24} md={12} lg={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'sku']}
                      label="SKU phân loại"
                      tooltip={`
                          SKU nên có nghĩa vd: "m--do--cao-su"
                        `}
                    >
                      <Input placeholder="Nhập vào" />
                    </Form.Item>
                  </Col>
                </Row>
              ))}
              <Button icon={<PlusCircleOutlined />} onClick={() => add()}>
                Thêm nhóm phân loại
              </Button>
            </>
          );
        }}
      </Form.List>
    </Container>
  );
}

const Container = styled.div`
  .form-list-group {
    position: relative;

    .form-list-close-button {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 1rem;
      padding: 5px;
      display: none;
      &:hover {
        opacity: 0.7;
      }
    }

    &:nth-child(even) {
      background-color: #f9f9f9;
    }
  }

  .form-list-group + .form-list-group {
    margin-top: 10px;
    padding-top: 20px;

    .form-list-close-button {
      display: inline;
    }
  }
`;

export default DynamicFormList;
