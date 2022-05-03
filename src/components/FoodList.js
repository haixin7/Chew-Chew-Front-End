import { Button, Card, List, message, Select, Tooltip, Popover } from "antd";
import { useEffect, useState } from "react";
import { addItemToCart, getMenus, getRestaurants } from "../utils";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const AddToCartButton = ({ itemId }) => {
  const [loading, setLoading] = useState(false);

  const AddToCart = () => {
    setLoading(true);
    addItemToCart(itemId)
      .then(() => message.success(`Successfully add item`))
      .catch((err) => message.error(err.message))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Tooltip title="Add to shopping cart">
      <Button
        loading={loading}
        type="primary"
        icon={<PlusOutlined />}
        onClick={AddToCart}
      />
    </Tooltip>
  );
};

const FoodList = () => {
  //current selected option
  const [curRest, setCurRest] = useState();
  const [loadingRest, setLoadingRest] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [foodData, setFoodData] = useState([]);

  //fetch rest list
  useEffect(() => {
    setLoadingRest(true);
    getRestaurants()
      .then((response) => {
        setRestaurants(response);
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoadingRest(false);
      });
  }, []);

  //fetch menu of current selected rest
  useEffect(() => {
    if (curRest) {
      setLoading(true);
      getMenus(curRest)
        .then((data) => {
          setFoodData(data);
        })
        .catch((err) => {
          message.error(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [curRest]);

  return (
    <>
      <Select
        value={curRest}
        onSelect={(value) => setCurRest(value)}
        placeholder="Select a restaurant"
        loading={loadingRest}
        style={{ width: 300 }}
        onChange={() => {}}
      >
        {restaurants.map((item) => {
          return (
            <Option value={item.id} key={item.id}>
              {item.name}
            </Option>
          );
        })}
      </Select>
      {curRest && (
        <List
          style={{ marginTop: 20 }}
          loading={loading}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 3,
            lg: 3,
            xl: 3,
            xxl: 3,
          }}
          dataSource={foodData}
          renderItem={(item) => (
            <List.Item>
              <Card
                title={item.name}
                extra={<AddToCartButton itemId={item.id} />}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{ height: "auto", width: "100%", display: "block" }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {`Price:$${item.price}`} {/*Price:{item.price}*/}
                  <Popover
                    content={item.description}
                    title={item.name}
                    trigger="click"
                  >
                    More
                  </Popover>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}
    </>
  );
};

export default FoodList;
