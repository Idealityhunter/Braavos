/**
 * 展示文章列表
 *
 * Created by lyn on 3/29/16.
 */

import { BraavosBreadcrumb } from '/client/components/breadcrumb/breadcrumb';
import { Button, ButtonGroup } from '/lib/react-bootstrap'
import { FixedDataTable} from '/lib/fixed-data-table'
const { Table, Column, Cell } = FixedDataTable;

const TextCell = React.createClass({
  propTypes: {
    // 第几行
    rowIndex: React.PropTypes.number,

    // table的数据
    data: React.PropTypes.object,

    // 列名称
    col: React.PropTypes.string,

    // 数据转换函数
    transform: React.PropTypes.func
  },

  render() {
    const {rowIndex, data, col, transform} = this.props;

    //let contents = data.getIn([rowIndex, ...col.split('.')]);
    let contents = data[rowIndex][col];
    if (transform && (typeof transform == 'function')) {
      contents = transform(contents);
    };

    const disabled = data[rowIndex]['status'] == 'disabled';
    return (
      <Cell style={disabled ? {color: '#ccc'} : {}}>
        {contents}
      </Cell>
    );
  }
});

// 操作
const OperationCell = ({rowIndex, data}) => {
  const articleId = data[rowIndex].articleId;

  // 控制进入专区编辑页面的函数
  const handleEdit = columnId => (e => {
    e.preventDefault();
    FlowRouter.go(`/activities/articles/edit/${articleId}`);
  });

  // 控制专区上线的函数
  const handleArticlePub = articleId => ((e) => {
    e.preventDefault();

    Meteor.call('activity.article.update.status', articleId, 'pub', function (err, res) {
      if (err) {
        swal("上线失败!", "", "error");
      }
      if (res) {
        swal("上线成功", "", "success");
      }
    });
  });

  // 控制专区下线的函数
  const handleArticleDisable = columnId => ((e) => {
    e.preventDefault();

    Meteor.call('activity.article.update.status', articleId, 'disabled', function (err, res) {
      if (err) {
        swal("下线失败!", "", "error");
      }
      if (res) {
        swal("下线成功", "", "success");
      }
    });
  });

  const status = data[rowIndex].status;
  const buttons = [
    <Button key={`${articleId}.edit`} bsClass="btn btn-white" onClick={handleEdit(articleId)}>编辑</Button>,

    // TODO 暂时先不做查看页面
    //<Button key={`${columnId}.view`} bsClass="btn btn-white" onClick={handleEdit()}>查看</Button>,

    // TODO 暂时不需要删除, 以免造成无法恢复的后果
    //,<Button key={`${columnId}.delete`} bsClass="btn btn-white" onClick={handleEdit()}>删除</Button>
  ];

  if (status == 'disabled'){
    buttons.push(<Button key={`${articleId}.pub`} bsClass="btn btn-white" onClick={handleArticlePub(articleId)}>上线</Button>);
  }

  if (status == 'pub'){
    buttons.push(<Button key={`${articleId}.disable`} bsClass="btn btn-white" onClick={handleArticleDisable(articleId)}>下线</Button>);
  }

  return (
    <Cell>
      <ButtonGroup bsSize="xsmall">
        {buttons}
      </ButtonGroup>
    </Cell>
  );
};

export const Articles = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
  },

  getMeteorData(){
    const articleSub = Meteor.subscribe('activity.article.bulk', {});

    let articles = [];
    if (articleSub.ready()){
      articles = BraavosCore.Database.Braavos.LocalityArticle.find({},{sort: {createTime: -1}}).fetch();
    }

    return {articles}
  },

  // 数据预处理 => country 和 locality 的提取
  processData(articles){
    return articles.map(article => _.extend(article, {
      country: article.country.zhName,
      locality: article.locality.zhName
    }))
  },

  render (){
    const articles = this.processData(this.data.articles);

    return (
      <div className="column-mngm-wrap">
        <BraavosBreadcrumb />
        <div className="wrapper wrapper-content animated fadeInRight">
          <a href="/activities/articles/add" style={{marginBottom: 20, display: 'block'}}>
            <Button bsStyle="info" bsSize="small"> + 添加文章</Button>
          </a>

          <Table
            rowsCount={articles.length}
            rowHeight={120}
            headerHeight={50}
            width={880}
            height={650}
          >
            <Column
              header={<Cell>文章编号</Cell>}
              cell={<TextCell data={articles} col="articleId"/>}
              fixed={true}
              width={80}
            />
            <Column
              header={<Cell>文章标题</Cell>}
              cell={<TextCell data={articles} col="title"/>}
              fixed={true}
              width={200}
            />
            <Column
              header={<Cell>文章简介</Cell>}
              cell={<TextCell data={articles} col="desc"/>}
              fixed={true}
              width={200}
            />
            <Column
              header={<Cell>国家</Cell>}
              cell={<TextCell data={articles} col="country"/>}
              fixed={true}
              width={100}
            />
            <Column
              header={<Cell>城市</Cell>}
              cell={<TextCell data={articles} col="locality"/>}
              fixed={true}
              width={100}
            />
            <Column
              header={<Cell>操作</Cell>}
              cell={<OperationCell data={articles}/>}
              fixed={true}
              width={200}
            />
          </Table>
        </div>
      </div>
    )
  }
});