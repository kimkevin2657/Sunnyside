package com.dfianswallet;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.ImageView; 
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity; import androidx.core.app.ActivityCompat; import androidx.core.content.ContextCompat;


import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {
    // @Override protected void onCreate(Bundle savedInstanceState) { 
    //     super.onCreate(savedInstanceState); 
    //     setContentView(R.layout.activity_main); checkSelfPermission();
    //     iv = findViewById(R.id.iv);
    //     iv.setOnClickListener(new View.OnClickListener() {
    //         @Override 
    //         public void onClick(View v) {
    //             Intent intent = new Intent();
    //             //기기 기본 갤러리 접근
    //             intent.setType(MediaStore.Images.Media.CONTENT_TYPE);
    //             //구글 갤러리 접근 
    //             //intent.setType("image/*");
    //             intent.setAction(Intent.ACTION_GET_CONTENT);
    //             startActivityForResult(intent, 101);
    //         }
    //     });
    // }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
//   @Override
//   protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
//       if (requestCode == 101 && resultCode == RESULT_OK) {
//           try {
//               InputStream is = getContentResolver().openInputStream(data.getData());
//               Bitmap bm = BitmapFactory.decodeStream(is);
//               is.close();
//               iv.setImageBitmap(bm);
//           } catch (Exception e) {
//               e.printStackTrace();
//           }
//       } else if (requestCode == 101 && resultCode == RESULT_CANCELED)
//      { Toast.makeText(this,"Cancel", Toast.LENGTH_SHORT).show(); } }

  @Override
  protected String getMainComponentName() {
    return "dfianswallet";
  }
}
