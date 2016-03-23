/**
 * 展示活动专区的列表
 *
 * Created by lyn on 3/22/16.
 */

import { BraavosBreadcrumb } from '/client/components/breadcrumb/breadcrumb';
//import { Input, Button, Alert } from '/lib/react-bootstrap'
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

    return (
      <Cell>
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
  const handleEdit = commodityId => (() => {
    const isAdmin = BraavosCore.Utils.account.isAdmin();
    FlowRouter.go(`/commodities/editor/${commodityId}?isAdmin=${isAdmin}`);
  });

  // 下架商品
  const handleDropCommodity = commodityId => (e => {
    e.preventDefault();
    swal({
      title: "确认下架?",
      text: "",
      type: "warning",
      showCancelButton: true,
      cancelButtonText: "取消",
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "下架",
      closeOnConfirm: false
    }, function () {
      Meteor.call('commodity.status.update', commodityId, 'disabled', function (err, res) {
        if (err) {
          // 下架失敗
          swal("下架失败!", "", "error");
        }
        if (res) {
          // 下架成功
          swal("下架成功", "", "success");
        }
      });
    });
  });

  // 上架商品
  const handlePubCommodity = commodityId => (e => {
    e.preventDefault();

    // 检查是否满足上架条件
    Meteor.call('commodity.check.publish', commodityId, function(err, res){
      if (err){
        swal("上架失败!", "", "error");
        return ;
      };

      // 未满足条件,则展示 method 传来的错误
      if (!res.status) {
        swal("上架失败!", (res.errorCode == 'Invalid Date') ? '您的商品套餐时间已过期，请重新选择.' : '', "error");
        return ;
      };

      if (res) {
        Meteor.call('commodity.status.update', commodityId, 'pub', function (err, res) {
          if (err) {
            // 上架失败
            swal("上架失败!", "", "error");
          }
          if (res) {
            // 上架成功
            swal("上架成功!", "", "success");
          }
        });
      };
    });
  });

  //const commodityId = commodity.get('commodityId');
  //const buttons = [<Button key={`${commodityId}.edit`} bsClass="btn btn-white"
  //                         onClick={handleEdit(commodityId)}>编辑</Button>];

  //const status = commodity.get('status');
  //if (status == 'pub') {
  //  buttons.push(<Button key={`${commodityId}.disabled`} bsClass="btn btn-white"
  //                       onClick={handleDropCommodity(commodity.get('commodityId'))}>下架</Button>);
  //} else if (status == 'disabled' || status == 'review' && BraavosCore.Utils.account.isAdmin()) {
  //  buttons.push(<Button key={`${commodityId}.pub`} bsClass="btn btn-white"
  //                       onClick={handlePubCommodity(commodity.get('commodityId'))}>上架</Button>);
  //}

  const columnId = data[rowIndex].id;
  const buttons = [
    <Button key={`${columnId}.edit`} bsClass="btn btn-white" onClick={handleEdit()}>编辑</Button>,
    <Button key={`${columnId}.view`} bsClass="btn btn-white" onClick={handleEdit()}>查看</Button>,
    <Button key={`${columnId}.online`} bsClass="btn btn-white" onClick={handleEdit()}>上线</Button>,
    <Button key={`${columnId}.disable`} bsClass="btn btn-white" onClick={handleEdit()}>下线</Button>
    // TODO 暂时不需要删除, 以免造成无法恢复的后果
    //,<Button key={`${columnId}.delete`} bsClass="btn btn-white" onClick={handleEdit()}>删除</Button>
  ];

  return (
    <Cell>
      <ButtonGroup bsSize="xsmall">
        {buttons}
      </ButtonGroup>
    </Cell>
  );
};

export const Columns = React.createClass({
  fakeData: [{
    id: 111212,
    title: '海岛专区',
    cover: 'http://images.taozilvxing.com/columnc1_beach.jpg',
    commodities: [1,2,3,4,5,6,7,7,8,9,9],
    count: 9,
    rank: 1
  }, {
    id: 111211232,
    title: '海岛专区',
    cover: 'http://images.taozilvxing.com/columnc1_beach.jpg',
    commodities: [1,2,3,4,5,6,7,7,8,9,9],
    count: 91,
    rank: 2
  }, {
    id: 111212123123,
    title: '海岛专区',
    cover: 'http://images.taozilvxing.com/columnc1_beach.jpg',
    commodities: [1,2,3,4,5,6,7,7,8,9,9],
    count: 20,
    rank: 3
  }, {
    id: 111212213123,
    title: '海岛专区',
    cover: 'http://images.taozilvxing.com/columnc1_beach.jpg',
    commodities: [1,2,3,4,5,6,7,7,8,9,9],
    count: 19,
    rank: 4
  }, {
    id: 111212123213123,
    title: '海岛专区',
    cover: 'http://images.taozilvxing.com/columnc1_beach.jpg',
    commodities: [1,2,3,4,5,6,7,7,8,9,9],
    count: 29,
    rank: 5
  }, {
    id: 111212123213213,
    title: '海岛专区',
    cover: 'http://images.taozilvxing.com/columnc1_beach.jpg',
    commodities: [1,2,3,4,5,6,7,7,8,9,9],
    count: 39,
    rank: 6
  }],

  getMeteorData(){

  },

  render (){
    const columns = this.fakeData;
    return (
      <div className="commodity-mngm-wrap">
        <BraavosBreadcrumb />
        <div className="wrapper wrapper-content animated fadeInRight">
          <Table
            rowsCount={columns.length}
            rowHeight={120}
            headerHeight={50}
            width={800}
            height={650}
          >
            <Column
              header={<Cell>活动名称</Cell>}
              cell={<TextCell data={columns} col="title"/>}
              fixed={true}
              width={200}
            />
            <Column
              header={<Cell>首页主图</Cell>}
              cell={<ImageCell data={columns} col="cover"/>}
              fixed={true}
              width={200}
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
              width={200}
            />
          </Table>
        </div>
      </div>
    )
  }
});