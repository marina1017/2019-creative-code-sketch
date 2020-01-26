//
//  ViewController.swift
//  09-ARtest
//
//  Created by 中川万莉奈 on 2019/12/22.
//  Copyright © 2019 中川万莉奈. All rights reserved.
//

import UIKit
import SceneKit
import ARKit

class ARViewController: UIViewController {
    var trackingStateLabel: UILabel = {
        var label = UILabel()
        label.backgroundColor = UIColor.black
        label.textColor = UIColor.white
        return label
    }()
    var wireframeSwitch: UISwitch!
    var fillMeshSwitch: UISwitch!
    
    //ARKit関連の機能をとりあつかいつつ、UIKitベースのUI階層内で三次元シーンを描画するためのクラス
    var sceneView: ARSCNView!
    //ARセッションによって提供される顔情報で使用するための顔トポロジのSceneKit表現。
    //ARSCNFaceGeometryもARFaceGeometryと同様に顔のジオメトリを表すクラス　SceneKitで手軽に利用できるように用意されているクラス
    private var faceGeometry: ARSCNFaceGeometry!
    //顔情報をもつNode
    private let faceNode = SCNNode()

    override func viewDidLoad() {
        super.viewDidLoad()
        //TrueDepthカメラ対応デバイスでなければその時点で弾く
        guard ARFaceTrackingConfiguration.isSupported else { fatalError("Not supported") }
        self.sceneView = ARSCNView()
        self.view.addSubview(self.sceneView)
        
        self.wireframeSwitch = UISwitch()
        self.fillMeshSwitch = UISwitch()
        self.wireframeSwitch.addTarget(self, action: #selector(wireframeSwitched), for: UIControl.Event.valueChanged)
        self.fillMeshSwitch.addTarget(self, action: #selector(fillMeshSwitched), for: UIControl.Event.valueChanged)
        self.view.addSubview(self.trackingStateLabel)
        self.view.addSubview(self.wireframeSwitch)
        self.view.addSubview(self.fillMeshSwitch)
        self.constraints()
        self.sceneView.delegate = self
        //ビューがシーンの照明を更新するかどうかを決定します。デフォルトはYesらしいが・・
        self.sceneView.automaticallyUpdatesLighting = true
        //SCNSceneは、3Dシーンを記述するクラスです。 ノード階層をカプセル化します。
        self.sceneView.scene = SCNScene()
        
        self.updateFaceGeometry()
        
        //フェイストラッキングを使う場合はこれを初期化してrunすればいいらしい。すごいね
        let configuration = ARFaceTrackingConfiguration()
        // 光の推定を有効または無効にします。
        configuration.isLightEstimationEnabled = true
        self.sceneView.session.run(configuration)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        //SafeAreaができたら制約をかける
        self.constraints()
        
    }
    
    @objc func wireframeSwitched(_ sender: UISwitch) {
        sceneView.debugOptions = wireframeSwitch.isOn ? [.renderAsWireframe] : []
    }

    @objc func fillMeshSwitched(_ sender: UISwitch) {
        updateFaceGeometry()
    }
    
    private func updateFaceGeometry() {
        //MTLDevice型をとっている
        let device = self.sceneView.device!
        //顔のジオメトリを表すARSCNFaceGeometryオブジェクトを生成
        //第一引数はMTLDevice型
        self.faceGeometry = ARSCNFaceGeometry(device: device, fillMesh: self.fillMeshSwitch.isOn)
        //ジオメトリの最初のマテリアルを決定します。 ジオメトリにマテリアルがない場合、nilを返します。
        //このメソッドは、便宜上ここにあります。 上記の「マテリアル」配列の最初のオブジェクトと同等です。
        if let material = self.faceGeometry.firstMaterial {
            material.diffuse.contents = UIColor.green
            material.lightingModel = .physicallyBased
        }
        self.faceNode.geometry = self.faceGeometry
    }

    func constraints() {
        self.sceneView.translatesAutoresizingMaskIntoConstraints = false
        // redViewの横方向の中心は、親ビューの横方向の中心と同じ
        self.sceneView.centerXAnchor.constraint(equalTo: self.view.centerXAnchor).isActive = true
        // redViewの縦方向の中心は、親ビューの縦方向の中心と同じ
        self.sceneView.centerYAnchor.constraint(equalTo: self.view.centerYAnchor).isActive = true
        // redViewの幅は、親ビューの幅
        self.sceneView.widthAnchor.constraint(equalTo: self.view.widthAnchor, multiplier: 1).isActive = true
        // redViewの親ビューの幅
        self.sceneView.heightAnchor.constraint(equalTo: self.view.heightAnchor, multiplier: 1).isActive = true
        
        
        self.trackingStateLabel.translatesAutoresizingMaskIntoConstraints = false
        self.trackingStateLabel.topAnchor.constraint(equalTo: self.view.safeAreaLayoutGuide.topAnchor).isActive = true
        // redViewの縦方向の中心は、親ビューの縦方向の中心と同じ
        self.trackingStateLabel.centerYAnchor.constraint(equalTo: self.view.centerYAnchor).isActive = true
        // redViewの幅は、親ビューの幅
        self.trackingStateLabel.widthAnchor.constraint(equalTo: self.view.widthAnchor, multiplier: 0.5).isActive = true
        // redViewの親ビューの幅
        self.trackingStateLabel.heightAnchor.constraint(equalTo: self.view.heightAnchor, multiplier: 0.05).isActive = true
        
        self.wireframeSwitch.translatesAutoresizingMaskIntoConstraints = false
        self.wireframeSwitch.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        self.wireframeSwitch.bottomAnchor.constraint(equalTo: self.view.safeAreaLayoutGuide.bottomAnchor).isActive = true
        self.wireframeSwitch.widthAnchor.constraint(equalTo: self.view.widthAnchor, multiplier: 0.2).isActive = true
        
        self.fillMeshSwitch.translatesAutoresizingMaskIntoConstraints = false
        self.fillMeshSwitch.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        self.fillMeshSwitch.bottomAnchor.constraint(equalTo: self.view.safeAreaLayoutGuide.bottomAnchor).isActive = true
        self.fillMeshSwitch.widthAnchor.constraint(equalTo: self.view.widthAnchor, multiplier: 0.2).isActive = true
        
    }

}

extension ARViewController: ARSCNViewDelegate {
//    これは、カメラの追跡状態が変更されたときに呼び出されます。
//      @param session実行中のセッション。
//      @param camera追跡状態を変更したカメラ。
    func session(_ session: ARSession, cameraDidChangeTrackingState camera: ARCamera) {
        print("trackingState: \(camera.trackingState)")
        self.trackingStateLabel.text = camera.trackingState.description
    }
    
    // 顔が検出されたら、下記関数が実行される。新しいアンカーに対応するノードがシーンに追加された
    func renderer(_ renderer: SCNSceneRenderer, didAdd node: SCNNode, for anchor: ARAnchor) {
        print("anchor:\(anchor), node: \(node), node geometry: \(String(describing: node.geometry))")
        //フェイストラッキングを開始し、ユーザーの顔が検出されるとその顔を表すARFaceAnchorオブジェクトがアンカーのリストに追加される
        //ARFaceAnchorはARPlaneAnchorやARImageAnchorと同様にARAnchorのサブクラスである delegeteで色々とれる
        guard let faceAnchor = anchor as? ARFaceAnchor else { return }
        
        //ARFaceクラスが持っているプロパティgeometryはARFaceGeometory型
        //顔の３Dメッシュデータを保持するモデルクラスがARFaceGeometory　検出した顔の位置や表情の変化に合わせて3Dメッシュデータが更新される
        //頂点、頂点インデックス、テクスチャ座標の配列を保持している 引数はARFaceGeometry型をいれる。
        /**
         Updates the geometry with the vertices of a face geometry.
         
         @param faceGeometry A face geometry.
         */
        //open func update(from faceGeometry: ARFaceGeometry)
        self.faceGeometry.update(from: faceAnchor.geometry)
        //faceNode（顔のジオメトリを持つノード）を子ノードとしてついか
        node.addChildNode(self.faceNode)
    }
    
    // 検出済みの顔が更新されるたびに下記関数が実行される。対応するアンカーの現在の状態に合うようにノードが更新された
    func renderer(_ renderer: SCNSceneRenderer, didUpdate node: SCNNode, for anchor: ARAnchor) {
        guard let faceAnchor = anchor as? ARFaceAnchor else { return }
        
        self.faceGeometry.update(from: faceAnchor.geometry)
    }
    
    // 削除されたアンカーに対応するノードがシーンから削除された
    func renderer(_ renderer: SCNSceneRenderer, didRemove node: SCNNode, for anchor: ARAnchor) {
        print("\(self.classForCoder)/" + #function)
    }
}


