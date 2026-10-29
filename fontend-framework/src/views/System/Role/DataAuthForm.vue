<script setup lang="ts" name="DataAuthForm">
import { reactive, ref, toRaw, UnwrapRef, watch } from 'vue';

import {
  Checkbox,
  Form,
  FormItem,
  Input,
  InputSearch,
  Modal,
  Select,
  Tree,
} from 'ant-design-vue';

import { getSelectDeptTree, setRoleDataAuth } from '/@/api/role';
import { messageWithKey } from '/@/hooks/useMessageKey';
import {
  filterOption,
  flattenTree,
  getParentKeyWithAttr,
} from '/@/utils/common';

interface FormState {
  dataScope: string;
  deptIds: any;
  roleId?: string;
  roleKey: string;
  roleName: string;
}

const props = defineProps({
  handleEffect: {
    default: () => {},
    type: Function,
  },
});

/** 数据范围选项*/
const dataScopeOptions = [
  { label: '全部数据权限', value: '1' },
  { label: '自定数据权限', value: '2' },
  { label: '本部门数据权限', value: '3' },
  { label: '本部门及以下数据权限', value: '4' },
  { label: '仅本人数据权限', value: '5' },
];

const useForm = Form.useForm;

const expandedKeys = ref<(number | string)[]>([]);
const searchValue = ref<string>('');
const autoExpandParent = ref<boolean>(true);
const checked = ref<boolean>(false);
const visible = ref<boolean>(false);
const roleId = ref<string>('');
const status = ref<string>('add');

const dataList = ref<any[]>([]);

const deptTree = ref<any[]>([]);

const formState: UnwrapRef<FormState> = reactive({
  dataScope: '2',
  deptIds: [],
  roleKey: '',
  roleName: '',
});

const rulesRef = reactive({});

const { resetFields, validate, validateInfos } = useForm(formState, rulesRef);

const title = '分配数据权限';

const onExpand: any = (keys: string[]) => {
  expandedKeys.value = keys;
  autoExpandParent.value = false;
};

const handleCancel = () => {
  resetFields();
  onExpand([]);
};

const showModal = async (record: any) => {
  Object.assign(formState, record);
  roleId.value = record.roleId;
  const {
    checkedKeys = [],
    code,
    depts = [],
    msg,
  }: any = await getSelectDeptTree(record.roleId);
  if (code === 200) {
    deptTree.value = depts;
    dataList.value = flattenTree(depts);
    formState.deptIds = checkedKeys;
    visible.value = true;
  } else {
    messageWithKey.error(msg);
  }
};

const handleOk = async () => {
  validate()
    .then(() => {
      onSubmit();
    })
    .catch(() => {});
};

const onSubmit = async () => {
  const values = toRaw(formState);
  values.deptIds = formState.deptIds.checked || formState.deptIds;
  values.roleId = roleId.value;
  const { code, msg }: any = await setRoleDataAuth(values);
  if (code === 200) {
    messageWithKey.success(msg);
    if (props.handleEffect) {
      props.handleEffect(status.value);
    }
    resetFields();
    visible.value = false;
    onExpand([]);
  } else {
    messageWithKey.error(msg);
  }
};

watch(searchValue, (value) => {
  const expanded = dataList.value
    .map((k: any) => {
      if (k.label.includes(value)) {
        return getParentKeyWithAttr(k.id, deptTree.value, 'id');
      }
      return null;
    })
    .filter(
      (item: any, i: number, self: any[]) => item && self.indexOf(item) === i,
    );
  expandedKeys.value = expanded as any;
  autoExpandParent.value = true;
});

defineExpose({
  showModal,
});
</script>

<template>
  <Modal
    v-model:open="visible"
    :width="640"
    :title="title"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <Form
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 14 }"
      autocomplete="off"
    >
      <FormItem label="角色名称" v-bind="validateInfos.roleName">
        <Input
          v-model:value="formState.roleName"
          disabled
          placeholder="请输入角色名称"
        />
      </FormItem>
      <FormItem label="权限字符" v-bind="validateInfos.roleKey">
        <Input
          v-model:value="formState.roleKey"
          disabled
          placeholder="请输入权限字符"
        />
      </FormItem>
      <FormItem label="权限范围" v-bind="validateInfos.dataScope">
        <Select
          v-model:value="formState.dataScope"
          :options="dataScopeOptions"
          show-search
          :filter-option="filterOption"
          class="w-216"
          placeholder="请选择权限范围"
        />
      </FormItem>
      <FormItem
        v-if="formState.dataScope === '2'"
        label="数据权限"
        v-bind="validateInfos.deptIds"
      >
        <InputSearch
          v-model:value="searchValue"
          allow-clear
          placeholder="请输入数据权限"
          class="margin-bottom-12"
        />
        <Checkbox v-model:checked="checked" class="margin-bottom-12">
          父子不联动
        </Checkbox>
        <div class="auth-form-body">
          <Tree
            v-model:checked-keys="formState.deptIds"
            :expanded-keys="expandedKeys"
            :field-names="{ children: 'children', title: 'label', key: 'id' }"
            :auto-expand-parent="autoExpandParent"
            checkable
            :check-strictly="checked"
            :selectable="false"
            :tree-data="deptTree"
            @expand="onExpand"
          >
            <template #title="{ label }">
              <span v-if="label.includes(searchValue)">
                {{ label.substring(0, label.indexOf(searchValue)) }}
                <span class="color-theme">{{ searchValue }}</span>
                {{
                  label.substring(
                    label.indexOf(searchValue) + searchValue.length,
                  )
                }}
              </span>
              <span v-else>{{ label }}</span>
            </template>
          </Tree>
        </div>
      </FormItem>
    </Form>
  </Modal>
</template>

<style lang="scss">
.auth-form-body {
  width: 100%;
  max-height: 480px;
  overflow-y: auto;
}
</style>
