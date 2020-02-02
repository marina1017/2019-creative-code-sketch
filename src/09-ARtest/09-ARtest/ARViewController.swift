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

class ARLabel: UILabel {
    override init(frame: CGRect) {
        super.init(frame: frame)
        self.backgroundColor = UIColor.lightGray.withAlphaComponent(0.50)
        self.textColor = UIColor.white
        self.font.withSize(5)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

class ARViewController: UIViewController {
    var trackingEyeLeftLabel: ARLabel = {
        var label = ARLabel(frame: CGRect.zero)
        return label
    }()
    
    var trackingEyeRightLabel: ARLabel = {
        var label = ARLabel(frame: CGRect.zero)
        return label
    }()
    
    var trackingMouthLabel: ARLabel = {
        var label = ARLabel(frame: CGRect.zero)
        return label
    }()
    
    var trackingTongueLabel: ARLabel = {
        var label = ARLabel(frame: CGRect.zero)
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
        self.view.addSubview(self.trackingEyeLeftLabel)
        self.view.addSubview(self.trackingEyeRightLabel)
        self.view.addSubview(self.trackingMouthLabel)
        self.view.addSubview(self.trackingTongueLabel)
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
            material.diffuse.contents = UIColor.blue
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
        
        
        self.trackingEyeLeftLabel.translatesAutoresizingMaskIntoConstraints = false
        self.trackingEyeLeftLabel.topAnchor.constraint(equalTo: self.view.safeAreaLayoutGuide.topAnchor).isActive = true
        self.trackingEyeLeftLabel.widthAnchor.constraint(equalTo: self.view.widthAnchor, multiplier: 1).isActive = true
        self.trackingEyeLeftLabel.heightAnchor.constraint(equalTo: self.view.heightAnchor, multiplier: 0.05).isActive = true
        
        self.trackingEyeRightLabel.translatesAutoresizingMaskIntoConstraints = false
        self.trackingEyeRightLabel.topAnchor.constraint(equalTo: self.trackingEyeLeftLabel.bottomAnchor).isActive = true
        self.trackingEyeRightLabel.widthAnchor.constraint(equalTo: self.view.widthAnchor, multiplier: 1).isActive = true
        self.trackingEyeRightLabel.heightAnchor.constraint(equalTo: self.view.heightAnchor, multiplier: 0.05).isActive = true
        
        self.trackingMouthLabel.translatesAutoresizingMaskIntoConstraints = false
        self.trackingMouthLabel.topAnchor.constraint(equalTo: self.trackingEyeRightLabel.bottomAnchor).isActive = true
        self.trackingMouthLabel.widthAnchor.constraint(equalTo: self.view.widthAnchor, multiplier: 1).isActive = true
        self.trackingMouthLabel.heightAnchor.constraint(equalTo: self.view.heightAnchor, multiplier: 0.05).isActive = true
        
        self.trackingTongueLabel.translatesAutoresizingMaskIntoConstraints = false
        self.trackingTongueLabel.topAnchor.constraint(equalTo: self.trackingMouthLabel.bottomAnchor).isActive = true
        self.trackingTongueLabel.widthAnchor.constraint(equalTo: self.view.widthAnchor, multiplier: 1).isActive = true
        self.trackingTongueLabel.heightAnchor.constraint(equalTo: self.view.heightAnchor, multiplier: 0.05).isActive = true
        
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
        //self.trackingEyeLeftLabel.text = camera.trackingState.description
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
        //blendShapesをつかってみる
        let blendShapes = faceAnchor.blendShapes
        guard let eyeBlinkLeft = blendShapes[.eyeBlinkLeft] as? Float,
            let eyeBlinkRight = blendShapes[.eyeBlinkRight] as? Float,
            let jawOpen = blendShapes[.jawOpen] as? Float,
            let tongue = blendShapes[.tongueOut] as? Float
            else { return }
        DispatchQueue.main.async {
            self.trackingEyeLeftLabel.text = "右目: \(String(1-eyeBlinkLeft))"
            self.trackingEyeRightLabel.text = "右目: \(String(1-eyeBlinkRight))"
            self.trackingMouthLabel.text = "口: \(String(jawOpen))"
            self.trackingTongueLabel.text = "舌: \(String(tongue))"
        }
        
        
        self.faceGeometry.update(from: faceAnchor.geometry)
    }
    
    // 削除されたアンカーに対応するノードがシーンから削除された
    func renderer(_ renderer: SCNSceneRenderer, didRemove node: SCNNode, for anchor: ARAnchor) {
        print("\(self.classForCoder)/" + #function)
    }
}


