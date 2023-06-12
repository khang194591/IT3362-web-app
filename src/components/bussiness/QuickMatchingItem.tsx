import StonksImage from "@/assets/images/stonks.jpg";
import UserProfilePopup from "@/components/bussiness/UserProfilePopup";
import { ArrowRightOutlined } from "@ant-design/icons";
import { IconMessage, IconToolsKitchen } from "@tabler/icons-react";
import { Avatar, Button, Image, Space, Tag, Tooltip, Typography } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { t } from "i18next";
import { useEffect, useState } from "react";

type Props = {} & Response.IQuickMatching;

function QuickMatchingItem(props: Props) {
  const [isJoined, setIsJoined] = useState(false);
  const [_now, setNow] = useState(Date.now());
  const time = dayjs(props.matchingDate).format("HH:mm");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number>();

  const remain = dayjs(time, "HH:mm").diff(Date.now(), "minute");

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  async function toggleIsJoined() {
    if (isJoined) {
      setIsJoined(false);
      await axios.patch(`/matching/leave/${props.id}`);
    } else {
      await axios.patch(`/matching/join/${props.id}`);
      setIsJoined(true);
    }
  }

  return (
    <div className="flex flex-col bg-white rounded-lg p-4 gap-4">
      <div className="-m-4">
        <Image preview={false} src={StonksImage} alt="" />
      </div>
      <div className="inline-flex items-center justify-between pt-4 font-semibold">
        <Typography.Paragraph
          ellipsis={{ tooltip: props.address }}
          className="text-xl"
        >
          {props.address}
        </Typography.Paragraph>
        {isJoined && (
          <Tag color="green" className="px-2 py-1">
            {t("matching.text.joined")}
          </Tag>
        )}
      </div>
      <div className="inline-flex items-center px-3 py-2 rounded-lg bg-yellow-50 gap-4">
        <div className="">
          <IconToolsKitchen size={20} strokeWidth={1.5} />
        </div>
        <p className="font-semibold">{props.desiredFood}</p>
      </div>
      <div className="inline-flex items-center px-3 py-2 rounded-lg bg-cyan-50 gap-4">
        <div className="">
          <IconMessage size={20} strokeWidth={1.5} />
        </div>
        <Typography.Paragraph
          ellipsis={{ tooltip: props.conversationTopics }}
          className="font-semibold !mb-0"
        >
          {props.conversationTopics}
        </Typography.Paragraph>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <Avatar size={40} src={props.owner.avatar || "/avatar.jpg"} />
          <div className="flex flex-col">
            <p>
              {t("matching.text.host")}: {props.owner.name}
            </p>
            <div className="inline-flex">
              <p className="mr-2">{t("matching.text.favorite")}</p>
              <Space size={[0, "small"]} wrap>
                <Tag color="blue">Soccer</Tag>
                <Tag color="blue">Chess</Tag>
              </Space>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p>
            {t("matching.text.time")}: {time}
          </p>
          {remain >= 0 ? (
            <p>{remain} min left</p>
          ) : (
            <Tag color="red" className="mr-0">
              {t("matching.text.expired")}
            </Tag>
          )}
        </div>
      </div>

      <div className="flex flex-row items-end justify-between">
        <div className="flex flex-col">
          <p className="text-base font-bold mb-2">
            {t("matching.text.participant")}: {props.userMatchings.length}
          </p>
          <Space size={[4, "small"]} wrap>
            {props.userMatchings.map((user) => (
              <Tooltip title={user.user.name} key={user.userId}>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setIsModalOpen(true);
                    setSelectedUser(user.userId);
                  }}
                >
                  <Avatar
                    src={user.user?.avatar || "/avatar.jpg"}
                    key={user.userId}
                  />
                </div>
              </Tooltip>
            ))}
          </Space>
        </div>
        <Button
          disabled={remain < 0}
          type={"primary"}
          danger={isJoined}
          onClick={toggleIsJoined}
        >
          {isJoined ? (
            <div className="inline-flex items-center gap-2">
              {t("common.button.cancel")}
            </div>
          ) : (
            <div className="inline-flex items-center gap-2">
              {t("common.button.join")}
              <ArrowRightOutlined />
            </div>
          )}
        </Button>
      </div>
      {selectedUser && (
        <UserProfilePopup
          userId={selectedUser}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
        />
      )}
    </div>
  );
}

export default QuickMatchingItem;