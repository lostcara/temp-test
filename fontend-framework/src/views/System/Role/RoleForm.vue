<script setup lang="ts" name="RoleForm">
import { computed, reactive, ref, toRaw, UnwrapRef, watch } from 'vue';

import {
  Checkbox,
  Form,
  FormItem,
  Input,
  InputNumber,
  InputSearch,
  Modal,
  RadioGroup,
  Tree,
} from 'ant-design-vue';

import { addRole, editRole } from '/@/api/role';
import useDictType from '/@/hooks/useDictType';
import { messageWithKey } from '/@/hooks/useMessageKey';
import useRoleMenuTree from '/@/hooks/useRoleMenuTree';
import { flattenTree, getParentKeyWithAttr } from '/@/utils/common';
import { RULE_LETTER, RULE_POSITIVE_INTEGER_NUMBER } from '/@/utils/rules';

interface FormState {
  menuIds: any;
  roleId?: string;
  roleKey: string;
  roleName: string;
  roleSort: number;
  status: string;
}

const props = defineProps({
  handleEffect: {
    default: () => {},
    type: Function,
  },
});

const useForm = Form.useForm;
const { menuTree } = useRoleMenuTree();
const { dictType } = useDictType(['sys_normal_disable']);

const expandedKeys = ref<(number | string)[]>([]);
const searchValue = ref<string>('');
const autoExpandParent = ref<boolean>(true);
const checked = ref<boolean>(false);
const visible = ref<boolean>(false);
const roleId = ref<string>('');
const status = ref<string>('add');

const dataList = computed(() => flattenTree(menuTree.value || []));

const formState: UnwrapRef<FormState> = reactive({
  menuIds: [],
  roleKey: '',
  roleName: '',
  roleSort: 1,
  status: '0',
});

const rulesRef = reactive({
  roleKey: [{ message: '请输入权限字符!', required: true }, RULE_LETTER],
  roleName: [
    { message: '请输入角色名称!', required: true },
    { max: 20, message: '长度不得超过20个字符!' },
  ],
  roleSort: [
    { message: '请输入角色顺序!', required: true },
    RULE_POSITIVE_INTEGER_NUMBER,
  ],
});

const { resetFields, validate, validateInfos } = useForm(formState, rulesRef);

const title = computed(() => {
  return status.value === 'add' ? '新增角色' : '编辑角色';
});

const onExpand: any = (keys: string[]) => {
  expandedKeys.value = keys;
  autoExpandParent.value = false;
};

const handleCancel = () => {
  resetFields();
  onExpand([]);
};

const showModal = (type: string, record: any) => {
  status.value = type;
  visible.value = true;
  if (type === 'edit') {
    formState.menuIds = record.menuIds;
    formState.roleName = record.roleName;
    roleId.value = record.roleId;
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
  if (checked.value) {
    values.menuIds = formState.menuIds.checked || formState.menuIds;
  }
  if (status.value === 'add') {
    const { code, msg }: any = await addRole(values);
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
  } else {
    values.roleId = roleId.value;
    const { code, msg }: any = await editRole(values);
    if (code === 200) {
      messageWithKey.success(msg);
      resetFields();
      props.handleEffect!(status.value);
      visible.value = false;
      onExpand([]);
    } else {
      messageWithKey.error(msg);
    }
  }
};

watch(searchValue, (value) => {
  const expanded = dataList.value
    .map((k: any) => {
      if (k.label.includes(value)) {
        return getParentKeyWithAttr(k.key, menuTree.value, 'key');
      }
      return null;
    })
    .filter(
      (item: any, i: number, self: any[]) => item && self.indexOf(item) === i,
    );
  expandedKeys.value = expanded;
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
          placeholder="请输入角色名称"
        />
      </FormItem>
      <FormItem label="权限字符" v-bind="validateInfos.roleKey">
        <Input v-model:value="formState.roleKey" placeholder="请输入权限字符" />
      </FormItem>
      <FormItem label="角色顺序" v-bind="validateInfos.roleSort">
        <InputNumber v-model:value="formState.roleSort" :min="1" :step="1" />
      </FormItem>
      <FormItem label="状态" v-bind="validateInfos.status">
        <RadioGroup
          v-model:value="formState.status"
          :options="dictType.sys_normal_disable"
        />
      </FormItem>
      <FormItem label="菜单权限" v-bind="validateInfos.menuIds">
        <InputSearch
          v-model:value="searchValue"
          allow-clear
          placeholder="请输入菜单权限"
          class="margin-bottom-12"
        />
        <Checkbox v-model:checked="checked" class="margin-bottom-12">
          父子不联动
        </Checkbox>
        <div class="role-form-body">
          <Tree
            v-model:checked-keys="formState.menuIds"
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            checkable
            :check-strictly="checked"
            :selectable="false"
            :tree-data="menuTree"
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
.role-form-body {
  width: 100%;
  max-height: 480px;
  overflow-y: auto;
}
</style>
