#!/bin/bash

set -euo pipefail

# クラスタ名の設定
CLUSTER_NAME="godblessyou-cluster"

# kindの設定ファイルを作成
cat <<EOF > kind-config.yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
- role: worker
- role: worker

# ローカルレジストリの設定
containerdConfigPatches:
- |-
  [plugins."io.containerd.grpc.v1.cri".registry.mirrors."localhost:5000"]
    endpoint = ["http://kind-registry:5000"]
EOF

# 既存のクラスタを削除（存在する場合）
if kind get clusters | grep -q "^${CLUSTER_NAME}$"; then
  echo "Deleting existing cluster..."
  kind delete cluster --name "${CLUSTER_NAME}"
fi

# ローカルレジストリの作成（存在しない場合）
if ! docker ps | grep -q 'kind-registry'; then
  echo "Creating local registry..."
  docker run -d --restart=always -p 5000:5000 --name kind-registry registry:2
fi

# kindクラスタの作成
echo "Creating kind cluster..."
kind create cluster --config kind-config.yaml --name "${CLUSTER_NAME}"

# ローカルレジストリをクラスタに接続
if ! docker network inspect kind | grep -q 'kind-registry'; then
  echo "Connecting registry to kind network..."
  docker network connect kind kind-registry || true
fi

# クラスタの状態を確認
echo "Waiting for cluster to be ready..."
kubectl wait --for=condition=Ready nodes --all --timeout=300s

# Ingressコントローラーのインストール
echo "Installing NGINX Ingress Controller..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

# admission webhookのセットアップを待機
echo "Waiting for admission webhook to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=admission-webhook \
  --timeout=300s || true

# Ingressコントローラーの準備完了を待機
echo "Waiting for Ingress Controller to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=600s

# すべてのPodの状態を確認
echo "Checking all pods..."
kubectl get pods --all-namespaces

echo "Kind cluster setup completed successfully!" 