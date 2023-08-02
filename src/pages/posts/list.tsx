import { HttpError, useGetIdentity, IResourceComponentsProps, useList } from "@refinedev/core";
import { IPost } from "../../interfaces";
import { List, Table, Typography } from "antd";
import { useTable, DeleteButton, useSimpleList, ImageField } from "@refinedev/antd";
import { CommentOutlined, LikeOutlined, ShareAltOutlined } from "@ant-design/icons";
import { storage } from "../../utility";
const { Text } = Typography;
export interface PostListProps extends IResourceComponentsProps {
  experimentId: string | undefined;
  lastAddedPost: string | undefined;
}
export const PostList: React.FC<PostListProps> = ({ experimentId, lastAddedPost }) => {


  const { listProps } = useSimpleList<IPost, HttpError>({
    resource: "64bfc5ca89fc8d8fbfa1",
    filters: {
      permanent: [
        {
          field: 'experiment_id',
          operator: 'eq',
          value: experimentId
        }
      ]
    }
  });

  console.log(listProps)


  const renderItem = (item: IPost) => {
    const { id, image, likes, comments, shares } = item;
    console.log('rerender', lastAddedPost)
    return (
      <List.Item actions={[<DeleteButton recordItemId={id} resource="64bfc5ca89fc8d8fbfa1" />]}>
        <List.Item.Meta description={renderImage(image)} />
        <List.Item.Meta description={<Text>{likes} <LikeOutlined /></Text>} />
        <List.Item.Meta description={<Text>{comments} <CommentOutlined /></Text>} />
        <List.Item.Meta description={<Text>{shares} <ShareAltOutlined /></Text>} />
      </List.Item>
    );
  };

  const renderImage = (imageId: string) => {
    return <ImageField style={{ 'padding': 10 }} width={100} value={storage.getFileView("64c1272a658c2465fffc", imageId).toString()} />;
  }


  return <List {...listProps} renderItem={renderItem} />;


}
