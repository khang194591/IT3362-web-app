import { AuthContext } from "@/contexts/auth";
import { useApiClient } from "@/shared/hooks/api";
import { StarFilled } from "@ant-design/icons";
import { Avatar, Button, Input, Rate, Space, Tag } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {} & Response.IUser;

interface IReview {
  content: string;
  createdAt: Date;
  id: number;
  parentCommentId: number;
  star: number;
  updatedAt: Date;
  user1: Response.IShortUser;
  user1Id: number;
  user2: Response.IShortUser;
  user2Id: number;
}

function UserReview(props: Props) {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [avarageRating, setAvarageRating] = useState(0);
  const apiClient = useApiClient("/review");

  async function handleSubmit() {
    setIsLoading(true);
    await apiClient.create({
      star: rating,
      content: comment,
      user2Id: props.id,
    });
    await fetchReviews();
    setRating(0);
    setComment("");
    setIsLoading(false);
  }

  const fetchReviews = async () => {
    const response = await axios.get(`/review?user2Id=${props.id}`);
    if (response.success) {
      const avarage = response.data.items.reduce(
        (accumulator: number, currentValue: any) =>
          accumulator + currentValue.star,
        0
      );
      setReviews(response.data.items);
      setAvarageRating(avarage / response.data.count);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="flex flex-row gap-12 bg-white rounded-lg px-6 py-4">
      <div className="flex flex-col items-center gap-2">
        <Avatar
          shape="square"
          size={96}
          src={props.avatar || "/avatar.jpg"}
          className="border border-solid border-slate-500"
        />
        <p className="text-2xl font-semibold">{props.name}</p>
        <p className="text-base">最後のマッチング: {"3 日前"}</p>
        <Rate
          allowHalf
          disabled
          value={avarageRating}
          character={<StarFilled style={{ fontSize: 32 }} />}
        />
        <p className="text-lg font-semibold">{t("matching.text.favorite")}:</p>
        <Space size={[0, "small"]} wrap>
          {user?.hobbies?.map((item) => (
            <Tag key={item.hobbyId} color="blue">
              {item.hobby?.name}
            </Tag>
          ))}
        </Space>
        <div className="w-full flex flex-col justify-start text-base mt-4 gap-1">
          <p>
            {t("auth.form.age.label")}: {props.age}
          </p>
          {/* <p>
            {t("auth.form.phone.label")}: {props.phone}
          </p> */}
          <p>
            {t("auth.form.nationality.label")}:{" "}
            {t(`nationality.${props.nationality}`)}
          </p>
          <p>
            {t("auth.form.languageSkills.label")}:{" "}
            {props.languageSkills
              ?.split(", ")
              .map((item) => t(`language.${item}`))
              .join(", ")}
          </p>
        </div>
      </div>
      <div className="flex-1 flex flex-col align-top">
        <p className="text-lg font-semibold mb-2">
          {t("matching.text.review")}
        </p>
        <div className="flex flex-col gap-4 border border-solid rounded-lg border-slate-300 p-4">
          {reviews?.map((review) => (
            <div
              key={review.id}
              className="flex flex-row gap-2 bg-slate-100 px-4 py-3 rounded-lg"
            >
              <Avatar
                src={review.user1.avatar || "/avatar.jpg"}
                className="shadow-lg"
              />
              <div className="flex flex-col w-full">
                <div className="w-full flex flex-row justify-between">
                  <p className="font-semibold">{review.user1.name}</p>
                  <p className="italic">
                    {dayjs(review.createdAt).format("h:mm A YYYY/MM/DD")}
                  </p>
                </div>
                <Rate disabled defaultValue={review.star} />
                <p>{review.content}</p>
              </div>
            </div>
          ))}
          {user?.id !== props.id && (
            <div className="flex flex-row gap-2 bg-primary bg-opacity-5 px-4 py-3 rounded-lg">
              <Avatar
                src={user?.avatar || "/avatar.jpg"}
                className="shadow-lg"
              />
              <div className="flex flex-col gap-2 w-full">
                <Rate
                  disabled={isLoading}
                  allowHalf
                  value={rating}
                  onChange={setRating}
                />
                <Space.Compact style={{ width: "100%" }}>
                  <Input
                    disabled={isLoading || !rating}
                    value={comment}
                    onChange={(e) => setComment(e.currentTarget.value)}
                    onPressEnter={handleSubmit}
                    placeholder={t("matching.form.comment.placeholder")}
                  />
                  <Button
                    loading={isLoading}
                    type="primary"
                    onClick={handleSubmit}
                  >
                    {t("common.button.submit")}
                  </Button>
                </Space.Compact>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserReview;
