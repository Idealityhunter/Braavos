/**
 * 展示活动专区的列表
 *
 * Created by lyn on 3/22/16.
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

const ImageCell = ({rowIndex, data, col}) => {
  //const contents = data.getIn([rowIndex, ...col.split('.'), 'url']);
  const contents = data[rowIndex][col];
  const dimension = 108;

  return (
    <Cell>
      <img width={dimension} height={dimension}
           src={`${contents}?imageView2/1/w/${dimension}/h/${dimension}`}/>
    </Cell>
  );
};


// 操作
const OperationCell = ({rowIndex, data}) => {
  const columnId = data[rowIndex].columnId;

  // 控制进入专区编辑页面的函数
  const handleEdit = columnId => (e => {
    e.preventDefault();
    FlowRouter.go(`/activities/columns/edit/${columnId}`);
  });

  // 控制专区上线的函数
  const handleColumnPub = columnId => ((e) => {
    e.preventDefault();

    Meteor.call('activity.column.update.status', columnId, 'pub', function (err, res) {
      if (err) {
        swal("上线失败!", "", "error");
      }
      if (res) {
        swal("上线成功", "", "success");
      }
    });
  });

  // 控制专区下线的函数
  const handleColumnDisable = columnId => ((e) => {
    e.preventDefault();

    Meteor.call('activity.column.update.status', columnId, 'disabled', function (err, res) {
      if (err) {
        swal("下线失败!", "", "error");
      }
      if (res) {
        swal("下线成功", "", "success");
      }
    });
  });

  // 控制专区数据的删除(暂时不展示该功能)
  const handleColumnDelete = columnId => ((e) => {
    e.preventDefault();

    Meteor.call('activity.column.delete', columnId, function (err, res) {
      if (err) {
        swal("删除失败!", "", "error");
      }
      if (res) {
        swal("删除成功", "", "success");
      }
    });
  });

  const status = data[rowIndex].status;
  const buttons = [
    <Button key={`${columnId}.edit`} bsClass="btn btn-white" onClick={handleEdit(columnId)}>编辑</Button>,

    // TODO 暂时先不做查看页面
    //<Button key={`${columnId}.view`} bsClass="btn btn-white" onClick={handleEdit()}>查看</Button>,

    // TODO 暂时不需要删除, 以免造成无法恢复的后果
    //,<Button key={`${columnId}.delete`} bsClass="btn btn-white" onClick={handleColumnDelete()}>删除</Button>
  ];

  if (status == 'disabled'){
    buttons.push(<Button key={`${columnId}.pub`} bsClass="btn btn-white" onClick={handleColumnPub(columnId)}>上线</Button>);
  }

  if (status == 'pub'){
    buttons.push(<Button key={`${columnId}.disable`} bsClass="btn btn-white" onClick={handleColumnDisable(columnId)}>下线</Button>);
  }

  return (
    <Cell>
      <ButtonGroup bsSize="xsmall">
        {buttons}
      </ButtonGroup>
    </Cell>
  );
};

export const Columns = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData(){
    const columnSub = Meteor.subscribe('activity.column.bulk', {columnType: {$in: ['special', 'locality']}});

    let columns = [];
    if (columnSub.ready()){
      columns = BraavosCore.Database.Braavos.Column.find({columnType: {$in: ['special', 'locality']}}, {sort: {rank: 1}}).fetch();
    }

    return {columns}
  },

  isLocalitySpecial(column){
    return column.columnType == 'locality'
  },

  // 数据预处理 => cover 的提取和 count 的计算
  processData(columns){
    return columns.map(column => _.extend(column, {
      cover: column.images[0].key && `http://images.taozilvxing.com/${column.images[0].key}` || column.images[0].url || '',
      count: column.commodities && column.commodities.length || 0,
      position: this.isLocalitySpecial(column) ? '城市专区' : '首页专区',
      country: this.isLocalitySpecial(column) ? column.country.zhName : '-',
      locality: this.isLocalitySpecial(column) ? column.locality.zhName : '-'
    }))
  },

  render (){
    const columns = this.processData(this.data.columns);

    return (
      <div className="column-mngm-wrap">
        <BraavosBreadcrumb />
        <div className="wrapper wrapper-content animated fadeInRight">
          <a href="/activities/columns/add" style={{marginBottom: 20, display: 'block'}}>
            <Button bsStyle="info" bsSize="small"> + 添加专区</Button>
          </a>

          <Table
            rowsCount={columns.length}
            rowHeight={120}
            headerHeight={50}
            width={1050}
            height={650}
          >
            <Column
              header={<Cell>专区编号</Cell>}
              cell={<TextCell data={columns} col="columnId"/>}
              fixed={true}
              width={100}
            />
            <Column
              header={<Cell>专区位置</Cell>}
              cell={<TextCell data={columns} col="position"/>}
              fixed={true}
              width={100}
            />
            <Column
              header={<Cell>活动名称</Cell>}
              cell={<TextCell data={columns} col="title"/>}
              fixed={true}
              width={150}
            />
            <Column
              header={<Cell>首页主图</Cell>}
              cell={<ImageCell data={columns} col="cover"/>}
              fixed={true}
              width={150}
            />
            <Column
              header={<Cell>国家</Cell>}
              cell={<TextCell data={columns} col="country"/>}
              fixed={true}
              width={100}
            />
            <Column
              header={<Cell>城市</Cell>}
              cell={<TextCell data={columns} col="locality"/>}
              fixed={true}
              width={100}
            />
            <Column
              header={<Cell>专区商品数量</Cell>}
              cell={<TextCell data={columns} col="count"/>}
              fixed={true}
              width={100}
            />
            <Column
              header={<Cell>排名</Cell>}
              cell={<TextCell data={columns} col="rank"/>}
              fixed={true}
              width={100}
            />
            <Column
              header={<Cell>操作</Cell>}
              cell={<OperationCell data={columns}/>}
              fixed={true}
              width={150}
            />
          </Table>
        </div>
      </div>
    )
  }
});