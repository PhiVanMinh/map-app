import { ITreeOptions, KEYS, TREE_ACTIONS, TreeComponent, TreeNode } from '@ali-hm/angular-tree-component';
import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { LandmarkCategory } from 'src/app/_models/landmark/landmark-category';
import { LandmarkTreeNode } from 'src/app/_models/landmark/landmark-tree-node';
import { Landmark } from 'src/app/_models/landmark/landmark.model';

@Component({
  selector: 'app-virtual-tree',
  templateUrl: './virtual-tree.component.html',
  styleUrls: ['./virtual-tree.component.scss']
})
export class VirtualTreeComponent implements OnInit, OnChanges {

  @ViewChild(TreeComponent) tree!: TreeComponent;
  nodes: LandmarkTreeNode[] = [];
  selectedNodes: LandmarkTreeNode[] = [];
  @Input() listLandmarks: Landmark[] = [];
  // landmarkDic = new DictionaryAutoOrder<number, Landmark>();
  @Input() listLandmarkCategorys: LandmarkCategory[] = [];

  @Output() onSelectedChanged = new EventEmitter<any>();
  @Output() onDataLoaded = new EventEmitter<any>();
  @Output() onEditClick = new EventEmitter<any>();

  options: ITreeOptions = {
    idField: 'id',
    displayField: 'name',
    useVirtualScroll: true,
    dropSlotHeight: 1,
    useCheckbox: false,
    actionMapping: {
      mouse: {
        click: (tree: any, node: any, $event: any) => {
          this.onClickNode(tree, node, $event);
        },
      },
      keys: {
        [KEYS.ENTER]: (tree: any, node: any, $event: any) => {
          this.onClickNode(tree, node, $event);
        },
        [KEYS.SPACE]: (tree: any, node: any, $event: any) => {
          this.onClickNode(tree, node, $event);
        },
      },
    },
  };

  ngOnChanges(changes: SimpleChanges): void {
    // for (const propName in changes) {
    //   if (propName === 'listLandmarks') {
    //     if (!changes['listLandmarks'].firstChange) {
    //       this.createTreeNodes();
    //       // this.landmarkDic = new DictionaryAutoOrder(this.listLandmarks, (x: { id: any; }) => x.id);
    //       break;
    //     }
    //   }
    // }
    this.createTreeNodes();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.autoHeightVirtualTree();
  }

  autoHeightVirtualTree() {
    if (this.tree) {
      const leftPanelMaxHeight = document.getElementById('left-panel-container')?.style.maxHeight ?? '0';
      const filterHeight = document.getElementById('filter')?.offsetHeight ?? 0;
      const dsxeToolHeight = document.getElementById('ds-tool')?.offsetHeight ?? 0;

      const treeViewport = document.querySelector('.virtual-tree-container tree-viewport');
      if (treeViewport) {
        const maxHeight = Number.parseInt(leftPanelMaxHeight) - filterHeight - dsxeToolHeight - 10;
        treeViewport.setAttribute('style', 'max-height:' + maxHeight + 'px');
      }
    }
  }

  constructor(
    // private obsSv: ObservationService, private landmarkSv: LandmarkService
  ) { }

  ngOnInit() { }

  createTreeNodes() {
    this.nodes = [];
    for (const category of this.listLandmarkCategorys) {
      // Tạo Category
      const categoryNode: LandmarkTreeNode = {
        id: category.id,
        name: category.name,
        iconUrl: category.icon,
        isGroup: true,
        children: [],
      };
      // Thêm các node con cho loại điểm
      const listChildLandmarks = this.listLandmarks.filter( (x) => x.categoryID === categoryNode.id);
      if (listChildLandmarks.length > 0) {
        listChildLandmarks.forEach((landmark) => {
          const childNode: LandmarkTreeNode = {
            id: landmark.id,
            name: landmark.name,
            landmarkCategoryID: landmark.categoryID,
            groupIDs: landmark.groupIDs,
            isVisible: landmark.isVisible,
            isLandmarkManagement: landmark.isLandmarkManagement,
          };
          categoryNode.children?.push(childNode);
        });

        this.nodes.push(categoryNode);
      }
    }

    // Thêm loại điểm chưa được gán
    const listNotHaveCategory = this.listLandmarks.filter(x => !x.categoryID || x.categoryID <= 0);
    if (listNotHaveCategory.length > 0) {
      const categoryNode: LandmarkTreeNode = {
        id: 0,
        name: 'Không có loại điểm được gán',
        iconUrl: '/assets/images/utility/landmark-management/point/no-assigned.png',
        isGroup: true,
        children: [],
      };
      listNotHaveCategory.forEach((landmark) => {
        const childNode: LandmarkTreeNode = {
          id: landmark.id,
          name: landmark.name,
          landmarkCategoryID: categoryNode.id,
          groupIDs: landmark.groupIDs,
          isVisible: landmark.isVisible,
          isLandmarkManagement: landmark.isLandmarkManagement,
        };
        categoryNode.children?.push(childNode);
      });
      this.nodes.unshift(categoryNode);
    }

    this.nodes = this.nodes.slice();

    // Thiết lập chế độ virtual scroll nếu có nhiều dữ liệu
    this.options.useVirtualScroll = this.listLandmarks.length > 50;

    // Bắn sự kiện kết thúc load dữ liệu
    this.onDataLoaded.emit(true);

    this.tree.sizeChanged();

    // Reset list đã chọn
    this.selectedNodes = [];
    this.onSelectedChanged.emit(true);
  }

  onClickNode(tree: any, node: TreeNode, e: { target: { type: string; title: any; }; }) {
    if (node) {
      // Focus vào dòng hiện tại
      this.tree.treeModel.setFocusedNode(node);
      if (node.hasChildren && e.target.type !== 'checkbox') {
        TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, e);
      }
      else if (!node.hasChildren) {
        const isEditOrDelete: boolean = e.target.title ? (e.target.title === 'Sửa' || e.target.title === 'Xóa') : false;
        // Panto bản đồ
        // const landmark = this.landmarkDic.get(node.data.id);
        // if (landmark) {
        //   this.landmarkSv.currentLandmark$.next({ landmark, isEditOrDelete });
        // }
      }
    }
  }

  toggleCheckbox(node: TreeNode, event: any) {
    let newValue = false;
    if (event) {
      newValue =
        event.target.type === 'checkbox'
          ? event.target.checked
          : !node.data.checked;
    }
    else {
      newValue = !node.data.checked;
    }
    this.updateChildNodesCheckBox(node, newValue);
    this.updateParentNodesCheckBox(node.parent);

    this.onSelectedChanged.emit(true);
  }

  private updateChildNodesCheckBox(node: TreeNode, checked: boolean) {
    node.data.checked = checked;
    if (node.children) {
      node.children.forEach((child: any) =>
        this.updateChildNodesCheckBox(child, checked)
      );
    }
    else {
      this.updateSelectedNodes(node.data, checked);
    }
  }

  public updateSelectedNodes(landmarkNode: LandmarkTreeNode, checked: boolean) {
    const index = this.selectedNodes.findIndex((x) => x.id === landmarkNode.id);
    if (checked) {
      if (index < 0) {
        this.selectedNodes.push(landmarkNode);
      }
    }
    else {
      if (index >= 0) {
        this.selectedNodes.splice(index, 1);
      }
    }
  }

  private updateParentNodesCheckBox(parentNode: TreeNode) {
    if (parentNode && parentNode.level > 0 && parentNode.children) {
      let allChildChecked = true;
      let noChildChecked = true;

      for (const child of parentNode.children) {
        if (!child.data.checked) {
          allChildChecked = false;
        }
        else if (child.data.checked) {
          noChildChecked = false;
        }
      }

      if (allChildChecked) {
        parentNode.data.checked = true;
        parentNode.data.indeterminate = false;
      }
      else if (noChildChecked) {
        parentNode.data.checked = false;
        parentNode.data.indeterminate = false;
      }
      else {
        parentNode.data.checked = true;
        parentNode.data.indeterminate = true;
      }
      this.updateParentNodesCheckBox(parentNode.parent);
    }
  }

  scrollToNode(node: TreeNode) {
    // Mở rộng node cha
    const parentNode = node.realParent;
    this.tree.treeModel.collapseAll();
    parentNode.expand();
    // Đánh dấu focused
    this.tree.treeModel.setFocusedNode(node);
    // Cuộn đến vị trí tương đối
    node.scrollIntoView();
    // Cuộn đến vị trí thực
    const check = setInterval(() => {
      const target = document.querySelector('.tree-node-focused');
      if (target) {
        // ElementHelper.scrollToElement(target);
        clearInterval(check);
      }
    }, 50);
  }

  editLandmark(id: number) {
    // const landmark = this.landmarkDic.get(id);
    // if (landmark) {
    //   // this.obsSv.landmarkSubjects.landmarkToEdit.next(landmark);
    //   this.onEditClick.emit(true);
    // }
  }

  deleteLanmark(node: TreeNode) {
    // common.confirm(LanguageKeys.LandmarkKeys.ConfirmDeleteLandmark, { contentParams: [node.data[LANDMARK_FIELDS.name].toUpperCase()] }).then(async (ok: any) => {
    //   if (ok) {
    //     const id: number = node.data[LANDMARK_FIELDS.id];
    //     const name: string = node.data[LANDMARK_FIELDS.name];

    //     const success = await this.landmarkSv.deleteLandmark([id], [name]).asPromise();
    //     if (success) {
    //       // Loại bỏ khỏi danh sách node đã chọn
    //       this.updateSelectedNodes(node.data, false);
    //       // Xóa ở các nơi khác
    //       this.obsSv.landmarkSubjects.landmarksDeleted.next([id]);
    //     }
    //   }
    // });
  }
}
