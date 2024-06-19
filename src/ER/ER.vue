<template>
  <div class="antv-x6">
    <div class="app-content" ref="containerRef"></div>
  </div>
</template>

<script>
import { Graph, Shape, FunctionExt } from "@antv/x6";
import ErJson from "./er.json";

const LINE_HEIGHT = 24;
const NODE_WIDTH = 150;
export default {
  name: "er",
  data() {
    return {
      graph: null,
      data: [],
      selectCell: "",
      canRedo: false,
      canUndo: false,
      canZoomOut: true,
      showRight: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // const that = this
      Graph.registerPortLayout(
        "erPortPosition",
        (portsPositionArgs) => {
          return portsPositionArgs.map((_, index) => {
            return {
              position: {
                x: 0,
                y: (index + 1) * LINE_HEIGHT,
              },
              angle: 0,
            };
          });
        },
        true
      );
      // 节点注册
      Graph.registerNode(
        "er-rect",
        {
          inherit: "rect",
          markup: [
            {
              tagName: "rect",
              selector: "body",
            },
            {
              tagName: "text",
              selector: "label",
            },
          ],
          attrs: {
            rect: {
              strokeWidth: 1,
              stroke: "#5F95FF",
              fill: "#5F95FF",
            },
            label: {
              fontWeight: "bold",
              fill: "#ffffff",
              fontSize: 12,
            },
          },
          ports: {
            groups: {
              column: {
                markup: [
                  {
                    tagName: "rect",
                    selector: "portBody",
                  },
                  {
                    tagName: "text",
                    selector: "columnCode",
                  },
                  {
                    tagName: "text",
                    selector: "dataType",
                  },
                  {
                    tagName: "image",
                    selector: "primaryKey",
                  },
                ],
                attrs: {
                  portBody: {
                    width: NODE_WIDTH,
                    height: LINE_HEIGHT,
                    strokeWidth: 1,
                    stroke: "#5F95FF",
                    fill: "#EFF4FF",
                    magnet: true,
                  },
                  columnCode: {
                    ref: "portBody",
                    refX: 6,
                    refY: 6,
                    fill: "#5F95FF",
                    fontSize: 10,
                    event: "node:port-contextmenu",
                  },
                  dataType: {
                    ref: "portBody",
                    refX: 70,
                    refY: 6,
                    fontSize: 10,
                    event: "node:port-contextmenu",
                  },
                  primaryKey: {
                    ref: "portBody",
                    width: 16,
                    height: 16,
                    x: 130,
                    y: 0,
                    event: "node:port-contextmenu",
                  },
                },
                position: "erPortPosition",
              },
            },
          },
        },
        true
      );
      const containerRef = this.$refs.containerRef;
      const graph = new Graph({
        container: containerRef,
        history: true, // 启动历史记录
        background: {
          color: "#ffffff",
        },
        grid: {
          size: 10, // 网格大小 10px
          visible: true, // 绘制网格，默认绘制 dot 类型网格
          type: "doubleMesh",
          args: [
            {
              color: "#E7E8EA",
              thickness: 1,
            },
            {
              color: "#CBCED3",
              thickness: 1,
              factor: 5,
            },
          ],
        },
        selecting: {
          // 选择与框选
          enabled: true,
          rubberband: true,
          movable: true,
          strict: true,
          showNodeSelectionBox: true, // 显示节点的选择框（才能进行移动）
          modifiers: ["alt"],
        },
        // Scroller 使画布具备滚动、平移、居中、缩放等能力
        scroller: {
          enabled: true,
          pageVisible: true,
          pageBreak: true,
          pannable: true,
        },
        // 鼠标滚轮的默认行为是滚动页面
        mousewheel: {
          enabled: true,
          modifiers: ["ctrl", "meta"], // +按键为缩放
          minScale: 0.5,
          maxScale: 2,
        },
        snapline: true, // 对齐线
        // background: '#f5f5f5', // 背景
        connecting: {
          router: {
            name: "er",
            args: {
              offset: 25,
              direction: "H",
            },
          },
          snap: true, // 自动吸附
          allowBlank: false, // 是否允许连接到画布空白位置的点
          allowLoop: false, // 是否允许创建循环连线，即边的起始节点和终止节点为同一节点
          allowNode: false, // 是否允许边链接到节点（非节点上的链接桩）
          createEdge() {
            return new Shape.Edge({
              attrs: {
                line: {
                  stroke: "#A2B1C3",
                  strokeWidth: 2,
                },
              },
            });
          },
        },
        // 高亮
        highlighting: {
          magnetAvailable: {
            name: "stroke",
            args: {
              padding: 4,
              attrs: {
                strokeWidth: 4,
                stroke: "#6a6c8a",
              },
            },
          },
        },
      });
      this.data = ErJson;
      const cells = [];
      ErJson.forEach((item) => {
        if (item.shape === "edge") {
          cells.push(graph.createEdge(item));
        } else {
          cells.push(graph.createNode(item));
        }
      });

      graph.resetCells(cells);
      graph.zoomToFit({ padding: 10, maxScale: 1 });
      this.graph = graph;
      this.loadEvents(containerRef);
    },
    loadEvents(containerRef) {
      // 节点双击
      this.graph.on("node:dblclick", ({ node }) => {
        const data = node.store.data;
        const { type, id } = data;
        alert("节点双击");
        console.log("node:dbclick", node);
        if (type === "taskNode") {
          this.nodeId = id;
          this.showRight = true;
        } else {
          this.nodeId = "";
          this.showRight = false;
        }
      });
      // 连线双击
      this.graph.on("edge:dblclick", ({ edge }) => {
        const data = edge.store.data;
        const { type, id } = data;
        alert("连线双击");
        console.log("edge:dbclick", edge);
        if (type === "taskNode") {
          this.nodeId = id;
          this.showRight = true;
        } else {
          this.nodeId = "";
          this.showRight = false;
        }
      });
      this.graph.on("node:collapse", ({ node }) => {
        node.toggleCollapse();
        const collapsed = node.isCollapsed();
        const cells = node.getDescendants();
        cells.forEach((node) => {
          if (collapsed) {
            node.hide();
          } else {
            node.show();
          }
        });
      });
      // 节点鼠标移入 TODO 移入后删除
      // this.graph.on(
      //   "node:mouseenter",
      //   FunctionExt.debounce(({ node }) => {
      //     // 添加删除
      //     node.addTools({
      //       name: "button-remove",
      //       args: {
      //         x: 0,
      //         y: 0,
      //         offset: { x: 140, y: 10 },
      //       },
      //     });
      //   }),
      //   500
      // );
      this.graph.on("node:port-contextmenu", ({ e }) => {
        console.log(
          "ports",
          e,
          e.currentTarget.parentElement.getAttribute("port")
        );
      });
      // 连接线鼠标移入 TODO 移入后删除
      // this.graph.on("edge:mouseenter", ({ edge }) => {
      //   edge.addTools([
      //     "source-arrowhead",
      //     "target-arrowhead",
      //     {
      //       name: "button-remove",
      //       args: {
      //         distance: "50%",
      //       },
      //     },
      //   ]);
      // });
      // 节点鼠标移出
      this.graph.on("node:mouseleave", ({ node }) => {
        // 移除删除
        node.removeTools();
      });
      this.graph.on("edge:mouseleave", ({ edge }) => {
        edge.removeTools();
      });
      this.graph.on("edge:connected", ({ isNew, edge }) => {
        console.log("connected", edge.source, edge.target);
        if (isNew) {
          // 对新创建的边进行插入数据库等持久化操作
        }
      });
    },
  },
};
</script>

<style scoped>
.antv-x6 {
  width: 100%;
  height: 100%;
  padding: 0;
  display: flex;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  .node-c {
    width: 200px;
    border-right: 1px solid #eee;
    padding: 20px;
    dl {
      margin-bottom: 20px;
      line-height: 30px;
      display: flex;
      cursor: move;
      dt {
        &.circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          &.start {
            border: 1px solid green;
            background: greenyellow;
          }
          &.end {
            border: 1px solid salmon;
            background: red;
          }
        }
        &.rect {
          width: 30px;
          height: 30px;
          border: 1px solid #ccc;
        }
      }
      dd {
        font-weight: bold;
        font-size: 14px;
        padding: 0 0 0 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .template-c {
    padding: 10px 0;
    li {
      line-height: 40px;
      font-size: 14px;
      border-bottom: 1px solid #dcdfe6;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      span {
        flex: 1;
        padding-right: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      i {
        font-size: 14px;
        color: #2d8cf0;
        width: 20px;
        line-height: 40px;
      }
    }
  }
  .container {
    flex: 1;
  }
  .operating {
    position: fixed;
    top: 0;
    left: 241px;
    z-index: 999;
    background-color: #ffffff;
    padding: 10px;
    box-shadow: 1px 1px 4px 0 #0a0a0a2e;
    i {
      font-size: 24px;
      cursor: pointer;
      margin: 0 10px;
      color: #515a6e;
      &:hover {
        color: #2d8cf0;
      }
      &.opacity {
        opacity: 0.5;
      }
    }
  }
}
.content {
  font-family: sans-serif;
  display: flex;
}

.app-stencil {
  width: 250px;
  border: 1px solid #f0f0f0;
  position: relative;
}

.app-content {
  flex: 1;
  height: 520px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}

.x6-graph-scroller {
  border: 1px solid #f0f0f0;
  margin-left: -1px;
}
</style>
